import { Modal } from "antd";
import { ProcessedInvoice, DynamicValue } from "../../../../../types";

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

  const renderSection = (data: Record<string, any>, title: string) => {
    const entries = Object.entries(data).filter(
      ([key, value]) =>
        !["images", "image_data"].includes(key) &&
        key !== "sender" &&
        value !== undefined &&
        value !== null &&
        renderDynamicValue(value) !== null
    );

    if (entries.length === 0) return null;

    return (
      <div className="border rounded p-4">
        <h3 className="text-lg font-medium mb-4">{title}</h3>
        <div className="grid gap-y-3">
          {entries.map(([key, value]) => {
            const renderedValue = renderDynamicValue(value);
            return renderedValue ? (
              <div key={key}>
                <p className="font-medium capitalize mb-1">
                  {key.split("_").join(" ")}:
                </p>
                <div className="ml-4">{renderedValue}</div>
              </div>
            ) : null;
          })}
        </div>
      </div>
    );
  };

  return (
    <Modal
      title={`Invoice Preview - ${invoiceDetails.file_name}`}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={800}
    >
      <div className="flex flex-col gap-4">
        <div className="border rounded p-4">
          <h3 className="text-lg font-medium mb-4">Basic Information</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-2">
            <p>
              <strong>Status:</strong> {invoiceDetails.processing_status}
            </p>
            <p>
              <strong>Created At:</strong>{" "}
              {new Date(invoiceDetails.created_at).toLocaleString()}
            </p>
            <p>
              <strong>Sender:</strong> {invoiceDetails.sender}
            </p>
            <p>
              <strong>File Name:</strong> {invoiceDetails.file_name}
            </p>
          </div>
        </div>

        {/* TODO: add this later */}

        {/* {renderSection(invoiceDetails.invoice_data, "Invoice Data")} */}

        {invoiceDetails.image_data && (
          <div className="border rounded p-4">
            <h3 className="text-lg font-medium mb-2">Invoice Image</h3>
            <img
              src={`data:image/jpeg;base64,${invoiceDetails.image_data}`}
              alt="Invoice Preview"
              className="w-full border rounded"
            />
          </div>
        )}
      </div>
    </Modal>
  );
};

export default InvoicePreviewModal;
