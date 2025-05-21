import { Tooltip } from "antd";
import { ProcessedInvoice } from "../../../../../../../../types";
import { useState } from "react";
import InvoicePreviewModal from "../invoicePreview";
import { useInvoiceProcessor } from "../../../../../../context/InvoiceProcessorContext";
import { WarningOutlined } from "@ant-design/icons";

interface FileNameProps {
  record: ProcessedInvoice;
}

const FileName = ({ record }: FileNameProps) => {
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] =
    useState<ProcessedInvoice | null>(null);

  const { duplicatesMapById } = useInvoiceProcessor();

  const togglePreviewModal = (invoice?: ProcessedInvoice) => {
    setSelectedInvoice(invoice || null);
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
      <InvoicePreviewModal
        open={showPreviewModal}
        onCancel={() => togglePreviewModal(undefined)}
        invoiceDetails={selectedInvoice}
      />
    </>
  );
};

export default FileName;
