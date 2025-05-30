import React, { useState, useEffect, useMemo, useRef } from "react";
import { Alert, Dropdown, Table } from "antd";
import type { TableColumnsType } from "antd";
import AppButton from "../../../../../../components/AppButton";
import { useLocation, useNavigate } from "react-router-dom";
import FilterHistoryModal from "./FilterHistoryModal";
import { filterDocuments } from "../../../../../../utils/filterDocuments";
import {
  ExtractionHistoryFilter,
  ProcessedDocument,
} from "../../../../../../types";
import { WarningOutlined } from "@ant-design/icons";
import { useDocumentProcessor } from "../../../../../../context/DocumentProcessorContext";
import { showNotification } from "../../../../../../utils/notification";
import { manageSSE } from "../../../../../../service/sseClient";
import { formatDocumentAndCreateMap } from "../../../utils";
import { PERMISSIONS } from "../../../../../../constants/permissions";
import { usePermission } from "../../../../../../context/PermissionContext";
import { formatDateTime } from "../../../../../../utils";
import ExtractionStatusItem from "./ExtractionStatusItem";
import { StatusType } from "../../../types";
import TableHeaderTooltip from "./TableHeaderTooltip";
import ConfidenceIndicator from "./ConfidenceIndicator";
import ReviewStatusBadge from "./ReviewStatusBadge";
import DocumentInReviewModal from "./DocumentInReviewModal";
import { useTemplate } from "../../../../../../context/TemplateContext";
import keycloakService from "../../../../../../service/keycloakService";
import ReviewButton from "./ReviewButton";
import FileName from "./FileName";
import { useApplication } from "../../../../../../context/ApplicationContext";

const ExtractionHistoryTable = () => {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDocInReviewModal, setShowDocInReviewModal] = useState(false);
  const [selectedDocumentIds, setSelectedDocumentIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [originalDocuments, setOriginalDocuments] = useState<
    ProcessedDocument[]
  >([]);
  const [displayDocuments, setDisplayDocuments] = useState<ProcessedDocument[]>(
    []
  );
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<ExtractionHistoryFilter | null>(null);
  const [confidenceSort, setConfidenceSort] = useState<string | null>(null);
  const [showAlert, setShowAlert] = useState(
    !sessionStorage.getItem("hideDuplicatesAlert")
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { userHasPermission } = usePermission();

  const canViewDuplicates = userHasPermission(PERMISSIONS.VIEW_DUPLICATE);
  const canGenerateInsights = userHasPermission(PERMISSIONS.GENERATE_INSIGHT);
  const canEditExtraction = userHasPermission(PERMISSIONS.EDIT_EXTRACTION);
  const canRetryExtraction = userHasPermission(PERMISSIONS.RETRY_EXTRACTION);

  const canPerformAction = canEditExtraction || canRetryExtraction;

  const sseRef = useRef<{ stop: () => void } | null>(null);
  const confidenceSortOptions = [
    "Lowest to Highest",
    "Highest to Lowest",
    "Reset",
  ];

  const {
    setDocumentsMapById,
    duplicatesMapById,
    duplicatesCount,
    currentDataSource,
    reviewDocument,
    setReviewDocument,
    fetchDataSource,
  } = useDocumentProcessor();

  const { documentType } = useApplication();

  const { templateItems, fetchTemplate } = useTemplate();

  const isReviewUpdateLoading =
    localStorage.getItem(`reviewStatusLoading`) === "true";

  const handleTemplatesFetch = async () => {
    if (!currentDataSource) {
      await fetchDataSource();
    }

    if (currentDataSource && (!templateItems || templateItems.length === 0)) {
      await fetchTemplate();
    }
  };

  const handleSSEMessage = (data: any) => {
    setLoading(false);

    if (data.error) {
      showNotification("error", data.error);
      return;
    }

    if (data.length === 0) {
      return;
    }

    const { formattedDocuments, documentMapById } = formatDocumentAndCreateMap(
      data.invoices
    );

    setOriginalDocuments(formattedDocuments);
    setDocumentsMapById(documentMapById);
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: data.total,
    }));
  };

  useEffect(() => {
    if (
      !location.state?.fromInsightsPage &&
      !location.state?.fromDuplicatesPage &&
      !location.state?.fromReviewpage
    ) {
      sessionStorage.removeItem("hideDuplicatesAlert");
      setShowAlert(true);
    }

    if (location.state?.fromReviewPage) {
      setTimeout(() => {
        // Status update delay
      }, 4000);
    }

    handleTemplatesFetch();
  }, []);

  useEffect(() => {
    if (!sseRef.current) {
      setLoading(true);
      sseRef.current = manageSSE(
        `/invoices/processed-stream?page=${pagination.current}&size=${pagination.pageSize}&document_type=${documentType}`,
        handleSSEMessage
      );
    }

    return () => {
      sseRef.current?.stop();
      sseRef.current = null;
    };
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (originalDocuments.length) {
      setDisplayDocuments(filterDocuments(originalDocuments, filters));
    }
  }, [filters, originalDocuments]);

  useEffect(() => {
    if (!confidenceSort || confidenceSort === "Reset") {
      setDisplayDocuments(filterDocuments(originalDocuments, filters));
      return;
    }

    const sorted = [...originalDocuments].sort((a, b) => {
      const aConfidence = a.extracted_content?.overall_confidence?.score ?? 0;
      const bConfidence = b.extracted_content?.overall_confidence?.score ?? 0;

      return confidenceSort === "Lowest to Highest"
        ? aConfidence - bConfidence
        : bConfidence - aConfidence;
    });

    const filteredSorted = filterDocuments(sorted, filters);
    setDisplayDocuments(filteredSorted);
  }, [confidenceSort, filters, originalDocuments]);

  const uniqueSenders = useMemo(() => {
    return Array.from(
      new Set(
        originalDocuments?.map((document) => document.email_metadata.sender)
      )
    ).filter(Boolean);
  }, [originalDocuments]);

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const toggleDocInReviewModal = () => {
    setShowDocInReviewModal(!showDocInReviewModal);
  };

  const handleFilterApply = (newFilters: ExtractionHistoryFilter) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleFilterClear = () => {
    setFilters(null);
    setShowFilterModal(false);
  };

  const handleDocumentReview = (record: ProcessedDocument) => {
    setReviewDocument(record);

    if (
      record.review_status === "in_review" &&
      record.editor?.user_id !== keycloakService.getUserId()
    ) {
      setShowDocInReviewModal(true);
      return;
    }

    navigate("../extraction-history/review");
  };

  const rowSelection = canGenerateInsights
    ? {
        onChange: (selectedRowKeys: React.Key[]) => {
          setSelectedDocumentIds(selectedRowKeys as string[]);
        },
        selectedRowKeys: selectedDocumentIds,
        getCheckboxProps: ({ processing_status }: ProcessedDocument) => ({
          disabled:
            processing_status.toLowerCase() === "processing" ||
            processing_status.toLowerCase() === "failed",
        }),
      }
    : undefined;

  const extractionHistoryColumns: TableColumnsType<ProcessedDocument> = [
    {
      title: "File Name",
      dataIndex: "file_name",
      render: (_, record: ProcessedDocument) => <FileName record={record} />,
    },
    {
      title: "Sender",
      dataIndex: "email_metadata",
      render: (data: { sender_email: string }) => (
        <span className="text-dark-gray text-[14px] font-medium">
          {data.sender_email}
        </span>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (text: string) => (
        <span className="text-[#28373] text-[14px]">
          {formatDateTime(text)}
        </span>
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span>Status</span>
          <TableHeaderTooltip header="processing_status" />
        </div>
      ),
      dataIndex: "processing_status",
      render: (text: string) => (
        <ExtractionStatusItem type={text.toLowerCase() as StatusType} />
      ),
    },
    {
      title: (
        <Dropdown
          menu={{
            items: confidenceSortOptions.map((option, index) => ({
              key: index,
              label: (
                <button
                  className="w-full text-left text-dark-gray"
                  onClick={() => setConfidenceSort(option)}
                >
                  {option}
                </button>
              ),
            })),
          }}
          trigger={["click"]}
        >
          <div className="flex items-center gap-1 cursor-pointer">
            <div className="flex">
              <img src="/assets/icons/arrow-down.svg" alt="arrow-down" />
              <img src="/assets/icons/arrow-up.svg" alt="arrow-up" />
            </div>
            <span>Confidence</span>
            <TableHeaderTooltip header="confidence" />
          </div>
        </Dropdown>
      ),
      dataIndex: "overall_confidence",
      render: (_: any, record: ProcessedDocument) => (
        <ConfidenceIndicator record={record} />
      ),
    },
    {
      title: (
        <div className="flex items-center gap-1">
          <span>Review Status</span>
          <TableHeaderTooltip header="review_status" />
        </div>
      ),
      dataIndex: "review_status",
      render: (_: any, record: ProcessedDocument) => (
        <div className="min-w-[90px]">
          <ReviewStatusBadge record={record} />
        </div>
      ),
    },
    ...(canPerformAction
      ? [
          {
            title: "",
            render: (_: any, record: ProcessedDocument) => (
              <ReviewButton
                record={record}
                handleReview={handleDocumentReview}
                canEdit={canEditExtraction}
                canRetry={canRetryExtraction}
              />
            ),
          },
        ]
      : []),
  ];

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
  };

  const handleAlertClose = () => {
    setShowAlert(false);
    sessionStorage.setItem("hideDuplicatesAlert", "true");
  };

  return (
    <div>
      <div
        className="flex p-4 border-r border-l border-t border-[#E4E7EC] gap-4 justify-end flex-wrap"
        style={{ borderTop: "2px solid #E4E7EC" }}
      >
        {!loading && (
          <img
            src="/assets/images/filter-btn.png"
            alt="Filter"
            className="cursor-pointer"
            onClick={toggleFilterModal}
          />
        )}
        {canGenerateInsights && (
          <AppButton
            children="View and Generate Insight"
            width="fit-content"
            className="mr-0 ml-0"
            onClick={() =>
              navigate("../extraction-history/generate-insights", {
                state: { selectedDocumentIds },
              })
            }
            disabled={selectedDocumentIds.length === 0}
          />
        )}
      </div>
      <div className="overflow-x-auto">
        <Table<ProcessedDocument>
          rowSelection={rowSelection}
          rowKey="id"
          columns={extractionHistoryColumns}
          dataSource={displayDocuments}
          className="app-table extraction-history-table no-vertical-lines"
          loading={loading || isReviewUpdateLoading}
          pagination={{ ...pagination, pageSizeOptions: ["10", "20"] }}
          onChange={handleTableChange}
          rowClassName={(record) => {
            const rowClasses = [];
            const { id, processing_status } = record;

            if (duplicatesMapById && duplicatesMapById[id]) {
              rowClasses.push("duplicate-row");
            }
            if (
              processing_status.toLowerCase() === "processing" ||
              processing_status.toLowerCase() === "failed"
            ) {
              rowClasses.push("disabled-row");
            }
            return rowClasses.join(" ");
          }}
        />
      </div>
      <DocumentInReviewModal
        open={showDocInReviewModal}
        onCancel={toggleDocInReviewModal}
        editor={reviewDocument?.editor}
      />
      <FilterHistoryModal
        open={showFilterModal}
        onCancel={toggleFilterModal}
        onApply={handleFilterApply}
        onClear={handleFilterClear}
        initialFilters={filters}
        senders={uniqueSenders}
      />
      {canViewDuplicates && !loading && showAlert && duplicatesCount > 0 && (
        <Alert
          className="duplicate-alert lg:w-[646px] md:w-auto"
          message={
            <p className="font-medium text-[14px]">
              Duplicate Documents Detected!
            </p>
          }
          description={
            <div className="font-normal text-[14px]">
              <p className="text-dark-gray">
                Found {duplicatesCount} duplicates across documents.
              </p>
              <p
                style={{ marginTop: 8 }}
                className="underline text-deep-blue cursor-pointer"
                onClick={() =>
                  navigate("../extraction-history/duplicates", {
                    state: { duplicatesCheckDone: true },
                  })
                }
              >
                View Duplicates
              </p>
            </div>
          }
          type="error"
          icon={<WarningOutlined />}
          onClose={handleAlertClose}
          showIcon
          closable
        />
      )}
    </div>
  );
};

export default ExtractionHistoryTable;
