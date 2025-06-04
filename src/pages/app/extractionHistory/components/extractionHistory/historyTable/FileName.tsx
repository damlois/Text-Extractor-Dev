import { Tooltip } from "antd";
import { useState } from "react";
import DocumentPreviewModal from "../documentPreview";
import { WarningOutlined } from "@ant-design/icons";
import { ProcessedDocument } from "../../../../../../types";
import { useDocumentProcessor } from "../../../../../../context/DocumentProcessorContext";

interface FileNameProps {
  record: ProcessedDocument;
}

const FileName = ({ record }: FileNameProps) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null);

  const { duplicatesMapById } = useDocumentProcessor();

  const togglePreviewModal = (document?: ProcessedDocument) => {
    setSelectedDocument(document || null);
    setShowPreviewModal(!showPreviewModal);
  };

  const docIsProcessing =
    record.processing_status.toLowerCase() === "processing";

  const canViewDocument = !record.is_unsupported_file && !docIsProcessing;
  return (
    <>
      <Tooltip
        title={
          docIsProcessing
            ? "Cannot view: document is still being processed"
            : record.is_unsupported_file
            ? "Incompatible document type"
            : undefined
        }
      >
        <span>
          <button
            className={`text-dark-gray text-[14px] font-medium ${
              canViewDocument && "underline"
            } text-left max-w-[12vw] truncate`}
            style={{
              display: "inline-block",
              verticalAlign: "top",
              pointerEvents: !canViewDocument ? "none" : "auto",
            }}
            onClick={() =>
              canViewDocument ? togglePreviewModal(record) : () => {}
            }
          >
            {record.file_name}
            {duplicatesMapById && duplicatesMapById[record.id] && (
              <WarningOutlined
                style={{ color: "#FF4D4F", marginLeft: "8px" }}
              />
            )}
          </button>
        </span>
      </Tooltip>
      <DocumentPreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal(undefined)}
        documentDetails={selectedDocument}
      />
    </>
  );
};

export default FileName;
