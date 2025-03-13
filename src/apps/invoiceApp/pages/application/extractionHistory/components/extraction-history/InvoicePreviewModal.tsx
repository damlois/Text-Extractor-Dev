import { Modal } from "antd";
import { ProcessedInvoice, DynamicValue } from "../../../../../../../types";

interface InvoicePreviewModalProps {
  open: boolean;
  onCancel: () => void;
  invoiceDetails: ProcessedInvoice | null;
}

const InvoicePreviewModal: React.FC<InvoicePreviewModalProps> = ({
  open,
  onCancel,
  invoiceDetails,
}) => {
  if (!invoiceDetails) return null;

  const renderDynamicValue = (
    value: DynamicValue,
    indent = 0
  ): JSX.Element | string | null => {
    if (value === null || value === undefined) return null;

    if (Array.isArray(value)) {
      const filteredValues = value
        .map((item) => renderDynamicValue(item, indent + 1))
        .filter(Boolean);
      if (filteredValues.length === 0) return null;

      return (
        <ul className="list-disc ml-4">
          {filteredValues.map((item, index) => (
            <li key={index} className="mb-1">
              {item}
            </li>
          ))}
        </ul>
      );
    }

    if (typeof value === "object") {
      const entries = Object.entries(value)
        .map(([key, val]) => {
          const renderedValue = renderDynamicValue(val, indent + 1);
          return renderedValue
            ? ([key, renderedValue] as [string, JSX.Element | string])
            : null;
        })
        .filter(
          (entry): entry is [string, JSX.Element | string] => entry !== null
        );

      if (entries.length === 0) return null;

      return (
        <div className={`${indent > 0 ? "ml-4" : ""}`}>
          {entries.map(([key, val]) => (
            <div key={key} className="mb-2">
              <span className="font-medium">{key.split("_").join(" ")}: </span>
              {val}
            </div>
          ))}
        </div>
      );
    }

    return value.toString();
  };

  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      width={600}
      className="app-modal"
      style={{ top: "24px" }}
    >
      <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
        Preview of {invoiceDetails.file_name}
      </div>
      <div className="p-6">
        {invoiceDetails.image_data && (
          <div>
            <img
              src={`data:image/jpeg;base64,${invoiceDetails.image_data}`}
              alt="Invoice Preview"
              className="w-full rounded"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InvoicePreviewModal;
