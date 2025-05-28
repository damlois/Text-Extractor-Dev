import { UpOutlined, DownOutlined } from "@ant-design/icons";
import { TableColumnsType, Table } from "antd";
import { useState } from "react";
import DocumentPreviewModal from "../extractionHistory/documentPreview/DocumentPreviewModal";
import { useDocumentProcessor } from "../../../../../context/DocumentProcessorContext";
import { DuplicateDocumentItemResponse, StatusType } from "../../types";
import { formatDateTime } from "../../../../../utils";
import TableHeaderTooltip from "../extractionHistory/historyTable/TableHeaderTooltip";
import ConfidenceIndicator from "../extractionHistory/historyTable/ConfidenceIndicator";
import ExtractionStatusItem from "../extractionHistory/historyTable/ExtractionStatusItem";
import ReviewStatusBadge from "../extractionHistory/historyTable/ReviewStatusBadge";

interface DuplicatesTableInterface {
  selectedDocumentIds: Record<string, string[]>;
  setSelectedDocumentIds: (
    data: React.SetStateAction<Record<string, string[]>>
  ) => void;
}

const DuplicatesTable = ({
  selectedDocumentIds,
  setSelectedDocumentIds,
}: DuplicatesTableInterface) => {
  const [selectedDocument, setSelectedDocument] =
    useState<DuplicateDocumentItemResponse | null>(null);

  const [showPreviewModal, setShowPreviewModal] = useState(false);

  const { duplicateMapByFileHash, setDuplicatesMapByFileHash } =
    useDocumentProcessor();

  const togglePreviewModal = (document?: DuplicateDocumentItemResponse) => {
    setSelectedDocument(document || null);
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
      setSelectedDocumentIds((prev) => ({
        ...prev,
        [hash]: selectedRowKeys as string[],
      }));
    },
    selectedRowKeys: selectedDocumentIds[hash] || [],
  });

  const duplicateDocumentItemResponsesColumns: TableColumnsType<DuplicateDocumentItemResponse> =
    [
      {
        title: "File Name",
        dataIndex: "file_name",
        render: (text: string, record: DuplicateDocumentItemResponse) => (
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
        render: (_: any, record: DuplicateDocumentItemResponse) => (
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
        render: (_: any, record: DuplicateDocumentItemResponse) => (
          <ReviewStatusBadge record={record} />
        ),
      },
    ];

  return (
    <>
      <div className="flex flex-col gap-6">
        {Object.entries(duplicateMapByFileHash || {}).map(
          ([hash, { visible, documents }]) => (
            <div key={hash}>
              <div
                className="p-4 border border-[#E4E7EC] cursor-pointer"
                onClick={() => toggleTableVisibility(hash)}
              >
                {visible ? <UpOutlined /> : <DownOutlined />}
                <span className="ml-6 font-medium text-[16px]">
                  Duplicates : {documents.length}
                </span>
              </div>
              {visible && (
                <div className="overflow-x-auto">
                  <Table<DuplicateDocumentItemResponse>
                    rowSelection={getRowSelection(hash)}
                    rowKey="id"
                    columns={duplicateDocumentItemResponsesColumns}
                    dataSource={documents}
                    pagination={{ pageSize: 5 }}
                    className="app-table extraction-history-table no-vertical-lines"
                  />
                </div>
              )}
            </div>
          )
        )}
      </div>
      <DocumentPreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal()}
        documentDetails={selectedDocument}
      />
    </>
  );
};

export default DuplicatesTable;
