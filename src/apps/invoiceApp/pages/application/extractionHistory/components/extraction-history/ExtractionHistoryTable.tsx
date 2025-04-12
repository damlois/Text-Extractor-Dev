import React, { useState, useEffect, useMemo, useRef } from "react";
import { Alert, Table } from "antd";
import type { TableColumnsType } from "antd";
import AppButton from "../../../../../../../components/AppButton";
import InvoicePreviewModal from "./InvoicePreviewModal";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { ProcessedInvoice } from "../../../../../../../types";
import { useLocation, useNavigate } from "react-router-dom";
import FilterHistoryModal from "./FilterHistoryModal";
import { filterInvoices } from "../../../../../../../utils/filterInvoices";
import { ExtractionHistoryFilter } from "../../../../../../../types";
import { WarningOutlined } from "@ant-design/icons";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import {
  handleError,
  showNotification,
} from "../../../../../../../utils/notification";
import { manageSSE } from "../../../../../../../service/sseClient";
import { formatInvoiceAndCreateMap } from "./utils";
import { PERMISSIONS } from "../../../../../constants/permissions";
import { usePermission } from "../../../../../context/PermissionContext";

const ExtractionHistoryTable = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProcessedInvoice | null>(null);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [invoices, setInvoices] = useState<ProcessedInvoice[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<ExtractionHistoryFilter | null>(null);
  const [pageInvoices, setPageInvoices] = useState<ProcessedInvoice[]>([]);
  const [showAlert, setShowAlert] = useState(
    !sessionStorage.getItem("hideDuplicatesAlert")
  );

  const navigate = useNavigate();
  const location = useLocation();
  const { userHasPermission } = usePermission();

  const canViewDuplicates = userHasPermission(PERMISSIONS.VIEW_DUPLICATE);
  const canGenerateInsights = userHasPermission(PERMISSIONS.VIEW_INSIGHTS);

  const sseRef = useRef<{ stop: () => void } | null>(null);

  const { setInvoicesMapById, duplicatesMapById, duplicatesCount } =
    useInvoiceProcessor();

  const handleSSEMessage = (data: any) => {
    setLoading(false);

    if (data.error) {
      showNotification("error", data.error);
      return;
    }

    const { formattedInvoices, invoiceMapById } = formatInvoiceAndCreateMap(
      data.invoices
    );

    setPageInvoices(formattedInvoices);
    setInvoicesMapById(invoiceMapById);
    setPagination((prevPagination) => ({
      ...prevPagination,
      total: data.total,
    }));
  };

  const fetchInvoices = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await invoiceProcessorApi.getProcessedInvoices({
        page,
        size,
      });

      const { formattedInvoices, invoiceMapById } = formatInvoiceAndCreateMap(
        response.data.data.invoices
      );

      setPageInvoices(formattedInvoices);
      setInvoicesMapById(invoiceMapById);
      setPagination({
        current: response.data.data.page,
        pageSize: response.data.data.size,
        total: response.data.data.total,
      });
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (
      !location.state?.fromInsightsPage &&
      !location.state?.fromDuplicatesPage
    ) {
      sessionStorage.removeItem("hideDuplicatesAlert");
      setShowAlert(true);
    }
  }, []);

  useEffect(() => {
    if (pagination.current === 1) {
      if (!sseRef.current) {
        sseRef.current = manageSSE(
          `/invoices/processed-stream?page=${pagination.current}&size=${pagination.pageSize}`,
          handleSSEMessage
        );
      }
    } else {
      sseRef.current?.stop();
      sseRef.current = null;
    }

    return () => {
      sseRef.current?.stop();
      sseRef.current = null;
    };
  }, [pagination.current, pagination.pageSize]);

  useEffect(() => {
    if (pageInvoices.length) {
      setInvoices(filterInvoices(pageInvoices, filters));
    }
  }, [filters, pageInvoices]);

  const uniqueSenders = useMemo(() => {
    return Array.from(
      new Set(pageInvoices?.map((invoice) => invoice.email_metadata.sender))
    ).filter(Boolean);
  }, [pageInvoices]);

  const togglePreviewModal = (invoice?: ProcessedInvoice) => {
    setSelectedInvoice(invoice || null);
    setShowPreviewModal(!showPreviewModal);
  };

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  const handleFilterApply = (newFilters: ExtractionHistoryFilter) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  };

  const handleFilterClear = () => {
    setFilters(null);
    setShowFilterModal(false);
  };

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedInvoiceIds(selectedRowKeys as string[]);
    },
    selectedRowKeys: selectedInvoiceIds,
    getCheckboxProps: ({ processing_status }: ProcessedInvoice) => ({
      disabled: processing_status.toLowerCase() === "processing",
    }),
  };

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
      dataIndex: "sender",
      render: (text: string) => (
        <span className="text-dark-gray text-[14px] font-medium">{text}</span>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      render: (text: string) => (
        <span className="text-[#28373] text-[14px]">
          {new Date(text).toLocaleDateString()}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "processing_status",
      render: (text: string) => (
        <span
          className={`${text.toLowerCase()} text-[12px] px-2 py-[2px] rounded-[100px]`}
        >
          {text.toLowerCase()}
        </span>
      ),
    },
  ];

  const handleTableChange = (newPagination: any) => {
    setPagination(newPagination);
    fetchInvoices(newPagination.current, newPagination.pageSize);
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
          dataSource={invoices}
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
