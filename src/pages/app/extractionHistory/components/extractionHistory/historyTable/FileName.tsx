import { Tooltip } from "antd";
import { useState } from "react";
import DocumentPreviewModal from "../documentPreview";
import { WarningOutlined } from "@ant-design/icons";
import { ProcessedDocument } from "../../../../../../types";

interface FileNameProps {
  record: ProcessedDocument;
}

const FileName = ({ record }: FileNameProps) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedDocument, setSelectedDocument] =
    useState<ProcessedDocument | null>(null);

  const { duplicatesMapById } = useDocuemntProcessor();

  const togglePreviewModal = (document?: ProcessedDocument) => {
    setSelectedDocument(document || null);
    setShowPreviewModal(!showPreviewModal);
  };

  return (
    <>
      <Tooltip
        title={
          record.isUnsupportedFile ? "Incompatible document type" : undefined
        }
      >
        <span>
          <button
            className={`text-dark-gray text-[14px] font-medium ${
              !record.isUnsupportedFile && "underline"
            } text-left max-w-[12vw] truncate`}
            style={{
              display: "inline-block",
              verticalAlign: "top",
              pointerEvents: record.isUnsupportedFile ? "none" : "auto",
            }}
            onClick={() => togglePreviewModal(record)}
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
function useDocuemntProcessor(): { duplicatesMapById: any; } {
  throw new Error("Function not implemented.");
}

