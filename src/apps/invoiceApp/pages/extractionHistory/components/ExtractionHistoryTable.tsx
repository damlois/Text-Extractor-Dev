import React, { useState, useEffect } from "react";
import { Table } from "antd";
import type { TableColumnsType } from "antd";
import AppButton from "../../../../../components/AppButton";
import InvoicePreviewModal from "./InvoicePreviewModal";
import { invoiceProcessorApi } from "../../../../../api/invoice-api";
import { ProcessedInvoice } from "../../../../../types";
import { useNavigate } from "react-router-dom";

const ExtractionHistoryTable = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
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

  const navigate = useNavigate();

  const fetchInvoices = async (page: number, size: number) => {
    setLoading(true);
    try {
      const response = await invoiceProcessorApi.getProcessedInvoices({
        page,
        size,
      });

      setInvoices(response.data.data.invoices);
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
    fetchInvoices(1, 10);
  }, []);

  const togglePreviewModal = (invoice?: ProcessedInvoice) => {
    setSelectedInvoice(invoice || null);
    setShowPreviewModal(!showPreviewModal);
  };

  const rowSelection = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ProcessedInvoice[]
    ) => {
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
          className="text-dark-gray text-[14px] font-medium underline text-left"
          onClick={() => togglePreviewModal(record)}
        >
          {text}
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
        <img
          src="/assets/images/filter-btn.png"
          alt="Filter"
          className="cursor-pointer"
        />
        <AppButton
          children="View and Generate Insight"
          width="fit-content"
          className="mr-0 ml-0"
          onClick={() => navigate("../extraction-history/generate-insights")}
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
          loading={loading}
          pagination={pagination}
          onChange={handleTableChange}
        />
      </div>
      <InvoicePreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal(undefined)}
        invoiceDetails={selectedInvoice}
      />
    </div>
  );
};

export default ExtractionHistoryTable;
