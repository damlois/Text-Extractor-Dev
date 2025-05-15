import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { TableColumnsType, Table } from "antd";
import { useState } from "react";
import InvoicePreviewModal from "../extractionHistory/invoicePreview/InvoicePreviewModal";
import { useInvoiceProcessor } from "../../../../../context/InvoiceProcessorContext";
import { DuplicateInvoiceItemResponse, StatusType } from "../../types";
import { formatDateTime } from "../../../../../../../utils";
import TableHeaderTooltip from "../extractionHistory/historyTable/TableHeaderTooltip";
import ConfidenceIndicator from "../extractionHistory/historyTable/ConfidenceIndicator";
import ExtractionStatusItem from "../extractionHistory/historyTable/ExtractionStatusItem";
import ReviewStatusBadge from "../extractionHistory/historyTable/ReviewStatusBadge";

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
  const [selectedInvoice, setSelectedInvoice] =
    useState<DuplicateInvoiceItemResponse | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { duplicateMapByFileHash, setDuplicatesMapByFileHash } =
    useInvoiceProcessor();

  const togglePreviewModal = (invoice?: DuplicateInvoiceItemResponse) => {
    setSelectedInvoice(invoice || null);
    setShowPreviewModal(!showPreviewModal);
  };

  const toggleTableVisibility = (hash: string) => {
    setDuplicatesMapByFileHash((prev) => ({
      ...prev,
      [hash]: { ...prev[hash], visible: !prev[hash].visible },
    }));
  };

  const getRowSelection = (hash: string) => ({
    onChange: (selectedRowKeys: React.Key[]) => {
      setSelectedInvoiceIds((prev) => ({
        ...prev,
        [hash]: selectedRowKeys as string[],
      }));
    },
    selectedRowKeys: selectedInvoiceIds[hash] || [],
  });

  const duplicateInvoiceItemResponsesColumns: TableColumnsType<DuplicateInvoiceItemResponse> =
    [
      {
        title: "File Name",
        dataIndex: "file_name",
        render: (text: string, record: DuplicateInvoiceItemResponse) => (
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
        dataIndex: "metadata",
        render: (metadata: { sender_email: string }) => (
          <span className="text-dark-gray text-[14px] font-medium">
            {metadata.sender_email}
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
          <div className="flex items-center gap-1">
            <span>Confidence</span>
            <TableHeaderTooltip header="confidence" />
          </div>
        ),
        render: (_: any, record: DuplicateInvoiceItemResponse) => (
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
        render: (_: any, record: DuplicateInvoiceItemResponse) => (
          <ReviewStatusBadge record={record} />
        ),
      },
    ];

  return (
    <>
      <div className="flex flex-col gap-6">
        {Object.entries(duplicateMapByFileHash || {}).map(
          ([hash, { visible, invoices }]) => (
            <div key={hash}>
              <div
                className="p-4 border border-[#E4E7EC] cursor-pointer"
                onClick={() => toggleTableVisibility(hash)}
              >
                {visible ? <UpOutlined /> : <DownOutlined />}
                <span className="ml-6 font-medium text-[16px]">
                  Duplicates : {invoices.length}
                </span>
              </div>
              {visible && (
                <div className="overflow-x-auto">
                  <Table<DuplicateInvoiceItemResponse>
                    rowSelection={getRowSelection(hash)}
                    rowKey="id"
                    columns={duplicateInvoiceItemResponsesColumns}
                    dataSource={invoices}
                    pagination={{ pageSize: 5 }}
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
