import React, { useState, useEffect, useMemo } from "react";
import { Alert, Table } from "antd";
import type { TableColumnsType } from "antd";
import AppButton from "../../../../../../../components/AppButton";
import InvoicePreviewModal from "./InvoicePreviewModal";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { ProcessedInvoice } from "../../../../../../../types";
import { useNavigate } from "react-router-dom";
import FilterHistoryModal from "./FilterHistoryModal";
import { filterInvoices } from "../../../../../../../utils/filterInvoices";
import { ExtractionHistoryFilter } from "../../../../../../../types";
import { WarningOutlined } from "@ant-design/icons";

const ExtractionHistoryTable = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProcessedInvoice | null>(null);
  const [selectedInvoiceIds, setSelectedInvoiceIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [invoices, setInvoices] = useState<ProcessedInvoice[]>([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [filters, setFilters] = useState<ExtractionHistoryFilter | null>(null);
  const [allInvoices, setAllInvoices] = useState<ProcessedInvoice[]>([]);

  const navigate = useNavigate();

  const fetchInvoices = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await invoiceProcessorApi.getProcessedInvoices({
        page,
        size,
      });

      const invoices = response.data.data.invoices.map((item) => ({
        ...item,
        sender: item.email_metadata.sender,
        processing_status:
          item.processing_status === "COMPLETED"
            ? "Successful"
            : item.processing_status,
      }));
      setAllInvoices(invoices);
      setInvoices(filterInvoices(invoices, filters));
      setPagination({
        current: response.data.data.page,
        pageSize: response.data.data.size,
        total: response.data.data.total,
      });
    } catch (error) {
      console.error("Error fetching invoices:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices(1, 20);
  }, []);

  useEffect(() => {
    if (allInvoices.length) {
      setInvoices(filterInvoices(allInvoices, filters));
    }
  }, [filters, allInvoices]);

  const uniqueSenders = useMemo(() => {
    return Array.from(
      new Set(allInvoices.map((invoice) => invoice.email_metadata.sender))
    ).filter(Boolean);
  }, [allInvoices]);

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
          {record.flag?.toLowerCase() === "duplicate" && (
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

  const handleTableChange = (pagination: any) => {
    fetchInvoices(pagination.current, pagination.pageSize);
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
      </div>
      <div className="overflow-x-auto">
        <Table<ProcessedInvoice>
          rowSelection={rowSelection}
          rowKey="id"
          columns={extractionHistoryColumns}
          dataSource={invoices}
          className="app-table extraction-history-table no-vertical-lines"
          rowClassName={(record) =>
            record.flag?.toLowerCase() === "duplicate" ? "duplicate-row" : ""
          }
          loading={loading}
          pagination={{ ...pagination, pageSizeOptions: ["10", "20"] }}
          onChange={handleTableChange}
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
              Found 6 duplicates across invoices.
            </p>
            <p
              style={{ marginTop: 8 }}
              className="underline text-deep-blue cursor-pointer"
              onClick={() => navigate('../extraction-history/duplicates')}
            >
              View Duplicates
            </p>
          </div>
        }
        type="error"
        icon={<WarningOutlined />}
        showIcon
        closable
      />
    </div>
  );
};

export default ExtractionHistoryTable;
