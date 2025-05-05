import React, { useState, useEffect, useMemo, useRef } from "react";
import { Alert, Dropdown, Table } from "antd";
import type { TableColumnsType } from "antd";
import AppButton from "../../../../../../../../components/AppButton";
import { ProcessedInvoice } from "../../../../../../../../types";
import { useLocation, useNavigate } from "react-router-dom";
import FilterHistoryModal from "./FilterHistoryModal";
import { filterInvoices } from "../../../../../../../../utils/filterInvoices";
import { ExtractionHistoryFilter } from "../../../../../../../../types";
import { EditOutlined, WarningOutlined } from "@ant-design/icons";
import { useInvoiceProcessor } from "../../../../../../context/InvoiceProcessorContext";
import {
  showNotification,
} from "../../../../../../../../utils/notification";
import { manageSSE } from "../../../../../../../../service/sseClient";
import { formatInvoiceAndCreateMap } from "../../../utils";
import { PERMISSIONS } from "../../../../../../constants/permissions";
import { usePermission } from "../../../../../../context/PermissionContext";
import { formatDateTime } from "../../../../../../../../utils";
import ExtractionStatusItem from "./ExtractionStatusItem";
import { StatusType } from "../../../types";
import TableHeaderTooltip from "./TableHeaderTooltip";
import ConfidenceIndicator from "./ConfidenceIndicator";
import ReviewStatusBadge from "./ReviewStatusBadge";
import DocumentInReviewModal from "./DocumentInReviewModal";
import InvoicePreviewModal from "../invoicePreview";
import { useTemplate } from "../../../../../../context/TemplateContext";

const ExtractionHistoryTable = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showDocInReviewModal, setShowDocInReviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProcessedInvoice | null>(null);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [originalInvoices, setOriginalInvoices] = useState<ProcessedInvoice[]>(
    []
  );
  const [displayInvoices, setDisplayInvoices] = useState<ProcessedInvoice[]>(
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

  const sseRef = useRef<{ stop: () => void } | null>(null);
  const confidenceSortOptions = [
    "Lowest to Highest",
    "Higehst to Lowest",
    "Reset",
  ];

  const {
    setInvoicesMapById,
    duplicatesMapById,
    duplicatesCount,
    currentDataSource,
    setReviewInvoice,
    fetchDataSource,
  } = useInvoiceProcessor();

  const { templateItems, fetchTemplate } = useTemplate();

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

    const { formattedInvoices, invoiceMapById } = formatInvoiceAndCreateMap(
      data.invoices
    );

    setOriginalInvoices(formattedInvoices);
    setInvoicesMapById(invoiceMapById);
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

    handleTemplatesFetch();
  }, []);

  useEffect(() => {
    if (!sseRef.current) {
      sseRef.current = manageSSE(
        `/invoices/processed-stream?page=${pagination.current}&size=${pagination.pageSize}`,
        handleSSEMessage
      );
    }

    return () => {
      sseRef.current?.stop();
      sseRef.current = null;
    };
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (originalInvoices.length) {
      setDisplayInvoices(filterInvoices(originalInvoices, filters));
    }
  }, [filters, originalInvoices]);

  useEffect(() => {
    if (!confidenceSort || confidenceSort === "Reset") {
      setDisplayInvoices(filterInvoices(originalInvoices, filters));
      return;
    }

    const sorted = [...originalInvoices].sort((a, b) => {
      const aConfidence = a.extracted_content?.overall_confidence?.score ?? 0;
      const bConfidence = b.extracted_content?.overall_confidence?.score ?? 0;

      return confidenceSort === "Lowest to Highest"
        ? aConfidence - bConfidence
        : bConfidence - aConfidence;
    });

    const filteredSorted = filterInvoices(sorted, filters);
    setDisplayInvoices(filteredSorted);
  }, [confidenceSort, filters, originalInvoices]);

  const uniqueSenders = useMemo(() => {
    return Array.from(
      new Set(originalInvoices?.map((invoice) => invoice.email_metadata.sender))
    ).filter(Boolean);
  }, [originalInvoices]);

  const togglePreviewModal = (invoice?: ProcessedInvoice) => {
    setSelectedInvoice(invoice || null);
    setShowPreviewModal(!showPreviewModal);
  };

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

  const handleDocumentReview = (record: ProcessedInvoice) => {
    // if (record.review_status === "in_review") {
    //   setShowDocInReviewModal(true);
    //   return;
    // }

    setReviewInvoice(record);
    navigate("../extraction-history/review", {
      state: { duplicatesCheckDone: true },
    });
  };

  const rowSelection = canGenerateInsights
    ? {
        onChange: (selectedRowKeys: React.Key[]) => {
          setSelectedInvoiceIds(selectedRowKeys as string[]);
        },
        selectedRowKeys: selectedInvoiceIds,
        getCheckboxProps: ({ processing_status }: ProcessedInvoice) => ({
          disabled: processing_status.toLowerCase() === "processing",
        }),
      }
    : undefined;

  const extractionHistoryColumns: TableColumnsType<ProcessedInvoice> = [
    {
      title: "File Name",
      dataIndex: "file_name",
      render: (text: string, record: ProcessedInvoice) => (
        <button
          className={`text-dark-gray text-[14px] font-medium underline text-left`}
          onClick={() => togglePreviewModal(record)}
        >
          {text}
          {duplicatesMapById && duplicatesMapById[record.id] && (
            <WarningOutlined style={{ color: "#FF4D4F", marginLeft: "8px" }} />
          )}
        </button>
      ),
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
      render: (_: any, record: ProcessedInvoice) => (
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
      render: (_: any, record: ProcessedInvoice) => (
        <ReviewStatusBadge record={record} />
      ),
    },
    ...(canEditExtraction
      ? [
          {
            title: "",
            render: (_: any, record: ProcessedInvoice) => {
              const isDisabled =
                record.processing_status.toLowerCase() === "processing" ||
                record.processing_status.toLowerCase() === "failed";

              return (
                <div
                  className={`inline-flex items-center gap-1 px-2 py-0.5 border rounded-[4px] transition-colors ${
                    isDisabled
                      ? "border-[#BFBFBF] text-[#00000040] cursor-not-allowed bg-[#F5F5F5] pointer-events-none"
                      : "border-[#006A94] text-[#006A94] hover:bg-[#E6F7FF] cursor-pointer"
                  }`}
                  onClick={() => !isDisabled && handleDocumentReview(record)}
                >
                  <EditOutlined />
                  <span className="text-[12px]">Review</span>
                </div>
              );
            },
          },
        ]
      : []),
  ];

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
    // fetchInvoices(newPagination.current, newPagination.pageSize);
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
                state: { selectedInvoiceIds },
              })
            }
            disabled={selectedInvoiceIds.length === 0}
          />
        )}
      </div>
      <div className="overflow-x-auto">
        <Table<ProcessedInvoice>
          rowSelection={rowSelection}
          rowKey="id"
          columns={extractionHistoryColumns}
          dataSource={displayInvoices}
          className="app-table extraction-history-table no-vertical-lines"
          loading={loading}
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
      <InvoicePreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal(undefined)}
        invoiceDetails={selectedInvoice}
      />
      <DocumentInReviewModal
        open={showDocInReviewModal}
        onCancel={toggleDocInReviewModal}
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
              Duplicate Invoices Detected!
            </p>
          }
          description={
            <div className="font-normal text-[14px]">
              <p className="text-dark-gray">
                Found {duplicatesCount} duplicates across invoices.
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
