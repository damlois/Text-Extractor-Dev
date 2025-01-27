import React from "react";
import { Table } from "antd";
import type { TableColumnsType, TableProps } from "antd";
import AppButton from "../../../../../components/AppButton";

interface ExtractionHistoryTableInfo {
  key: React.Key;
  fileName: string;
  id: string;
  sourceType: string;
  sender: string;
  date: string;
  status: string;
}

const ExtractionHistoryTable = () => {
  const columns: TableColumnsType<ExtractionHistoryTableInfo> = [
    {
      title: "File Name",
      dataIndex: "fileName",
      render: (text: string) => (
        <a className="text-dark-gray text-[14px] font-medium underline">
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
        <span className="text-[#006A94] text-[12px] px-2 py-[2px] rounded-[100px] bg-[#CCE1EA] ">
          {text}
        </span>
      ),
    },
  ];

  const data: ExtractionHistoryTableInfo[] = [
    {
      key: "1",
      fileName: "Invoice 1.pdf",
      id: "#4524524",
      sourceType: "invoices@company.com",
      sender: "anita@gmail.com",
      date: "6/1/2025",
      status: "Successful",
    },
    {
      key: "2",
      fileName: "Invoice 1.pdf",
      id: "#4524524",
      sourceType: "invoices@company.com",
      sender: "anita@gmail.com",
      date: "6/1/2025",
      status: "Successful",
    },
    {
      key: "3",
      fileName: "Invoice 1.pdf",
      id: "#4524524",
      sourceType: "invoices@company.com",
      sender: "anita@gmail.com",
      date: "6/1/2025",
      status: "Successful",
    },
    {
      key: "4",
      fileName: "Invoice 1.pdf",
      id: "#4524524",
      sourceType: "invoices@company.com",
      sender: "anita@gmail.com",
      date: "6/1/2025",
      status: "Successful",
    },
  ];

  const rowSelection: TableProps<ExtractionHistoryTableInfo>["rowSelection"] = {
    onChange: (
      selectedRowKeys: React.Key[],
      selectedRows: ExtractionHistoryTableInfo[]
    ) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
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
        />
      </div>
      <div className="overflow-x-auto">
        <Table<ExtractionHistoryTableInfo>
          rowSelection={{ type: "checkbox", ...rowSelection }}
          columns={columns}
          dataSource={data}
          className="invoice-app-table extraction-history-table no-vertical-lines"
        />
      </div>
    </div>
  );
};

export default ExtractionHistoryTable;
