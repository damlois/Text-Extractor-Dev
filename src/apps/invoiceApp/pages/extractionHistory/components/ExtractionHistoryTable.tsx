import React, { useState } from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import AppButton from "../../../../../components/AppButton";
import InvoicePreviewModal from "./InvoicePreviewModal";
import { extractionHistoryData } from "../constants";
import { ExtractionHistoryTableInfo } from "../types";
import { useNavigate } from "react-router-dom";

const ExtractionHistoryTable = () => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoiceDetails, setSelectedInvoiceDetails] =
    useState<ExtractionHistoryTableInfo | null>(null);

  const togglePreviewModal = (rowDetails?: ExtractionHistoryTableInfo) => {
    setSelectedInvoiceDetails(rowDetails || null);
    setShowPreviewModal(!showPreviewModal);
  };

  const navigate = useNavigate();

  const extractionHistoryColumns: TableColumnsType<ExtractionHistoryTableInfo> =
    [
      {
        title: "File Name",
        dataIndex: "fileName",
        render: (text: string, record: ExtractionHistoryTableInfo) => (
          <a
            className="text-dark-gray text-[14px] font-medium underline"
            onClick={() => togglePreviewModal(record)}
          >
            {text}
          </a>
        ),
      },
      {
        title: "ID",
        dataIndex: "id",
        render: (text: string) => (
          <span className="text-[#28373] text-[14px]">{text}</span>
        ),
      },
      {
        title: "Type of Source",
        dataIndex: "sourceType",
        render: (text: string) => (
          <span className="text-dark-gray text-[14px] font-medium">{text}</span>
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
        dataIndex: "date",
        render: (text: string) => (
          <span className="text-[#28373] text-[14px]">{text}</span>
        ),
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (text: string) => (
          <span
            className={`${text.toLowerCase()} text-[12px] px-2 py-[2px] rounded-[100px]`}
          >
            {text}
          </span>
        ),
      },
    ];

  const rowSelection: TableProps<ExtractionHistoryTableInfo>["rowSelection"] = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ExtractionHistoryTableInfo[]
    ) => {
      console.log(
        "selectedRowKeys: ",
        selectedRowKeys,
        "selectedRows: ",
        selectedRows
      );
    },
  };

  return (
    <div>
      <div
        className="flex p-4 border-r border-l border-t border-[#E4E7EC] gap-4 justify-end flex-wrap"
        style={{ borderTop: "2px solid #E4E7EC" }}
      >
        <img src="/assets/images/filter-btn.png" className="cursor-pointer" />
        <AppButton
          children="View and Generate Insight"
          width="fit-content"
          className="mr-0 ml-0"
          onClick={() => navigate("../extraction-history/generate-insight")}
        />
      </div>
      <div className="overflow-x-auto">
        <Table<ExtractionHistoryTableInfo>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          columns={extractionHistoryColumns}
          dataSource={extractionHistoryData}
          className="invoice-app-table extraction-history-table no-vertical-lines"
        />
      </div>
      <InvoicePreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal(undefined)}
        invoiceDetails={selectedInvoiceDetails}
      />
    </div>
  );
};

export default ExtractionHistoryTable;
