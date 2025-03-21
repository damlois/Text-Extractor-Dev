import { Modal } from "antd";
import { ProcessedInvoice } from "../../../../../../../types";

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
