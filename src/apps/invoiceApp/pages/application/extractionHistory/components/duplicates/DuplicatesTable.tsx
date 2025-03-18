import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { TableColumnsType, Table } from "antd";
import { useEffect, useState } from "react";
import { ProcessedInvoice } from "../../../../../../../types";
import { DuplicateTableData } from "../../types";
import InvoicePreviewModal from "../extraction-history/InvoicePreviewModal";

interface DuplicatesTableInterface {
  selectedInvoiceIds: Record<string, string[]>;
  setSelectedInvoiceIds: (
    data: React.SetStateAction<Record<string, string[]>>
  ) => void;
}

const DuplicatesTable = ({
  selectedInvoiceIds,
  setSelectedInvoiceIds,
}: DuplicatesTableInterface) => {
  const [duplicatesData, setDuplicatesData] = useState<
    Record<string, DuplicateTableData>
  >({});

  const [selectedInvoice, setSelectedInvoice] =
    useState<ProcessedInvoice | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  useEffect(() => {
    setDuplicatesData({
      invoice_1270: {
        visible: true,
        invoices: [
          {
            id: "inv-001",
            file_name: "Invoice_April_2024.pdf",
            content: "Invoice details...",
            extracted_content: {},
            image_data: "base64string",
            email_metadata: {
              sender: "john.doe@example.com",
              receiver: "accounts@company.com",
            },
            source: "Email",
            processing_status: "completed",
            created_at: "2024-04-15T10:00:00Z",
            flag: "Duplicate",
          },
        ],
      },
      invoice_1370: {
        visible: true,
        invoices: [
          {
            id: "inv-002",
            file_name: "Invoice_March_2024.pdf",
            content: "Invoice details...",
            extracted_content: {},
            image_data: "base64string",
            email_metadata: {
              sender: "jane.smith@vendor.com",
              receiver: "finance@company.com",
            },
            source: "Upload",
            processing_status: "completed",
            created_at: "2024-03-10T15:30:00Z",
            flag: "Duplicate",
          },
        ],
      },
    });
  }, []);

  const togglePreviewModal = (invoice?: ProcessedInvoice) => {
    setSelectedInvoice(invoice || null);
    setShowPreviewModal(!showPreviewModal);
  };

  const toggleTableVisibility = (tableId: string) => {
    setDuplicatesData((prev) => ({
      ...prev,
      [tableId]: { ...prev[tableId], visible: !prev[tableId].visible },
    }));
  };

  const getRowSelection = (tableId: string) => ({
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedInvoiceIds((prev) => ({
        ...prev,
        [tableId]: selectedRowKeys as string[],
      }));
    },
    selectedRowKeys: selectedInvoiceIds[tableId] || [],
  });

  const duplicateInvoicesColumns: TableColumnsType<ProcessedInvoice> = [
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
      dataIndex: ["sender"],
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

  return (
    <>
      <div className="flex flex-col gap-6">
        {Object.entries(duplicatesData).map(
          ([tableId, { visible, invoices }]) => (
            <div key={tableId}>
              <div
                className="p-4 border border-[#E4E7EC] cursor-pointer"
                onClick={() => toggleTableVisibility(tableId)}
              >
                {visible ? <UpOutlined /> : <DownOutlined />}
                <span className="ml-6 font-medium text-[16px]">
                  Duplicates ({tableId})
                </span>
              </div>
              {visible && (
                <div className="overflow-x-auto">
                  <Table<ProcessedInvoice>
                    rowSelection={getRowSelection(tableId)}
                    rowKey="id"
                    columns={duplicateInvoicesColumns}
                    dataSource={invoices}
                    // pagination={invoices.length > 5 ? { pageSize: 5 } : false}
                    className="app-table extraction-history-table no-vertical-lines"
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
      <InvoicePreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal()}
        invoiceDetails={selectedInvoice}
      />
    </>
  );
};

export default DuplicatesTable;
