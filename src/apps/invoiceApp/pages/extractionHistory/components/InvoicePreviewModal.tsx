import { Modal } from "antd";
import { ExtractionHistoryTableInfo } from "../types";

interface InvoicePreviewModalProps {
  open: boolean;
  onCancel: () => void;
  invoiceDetails: ExtractionHistoryTableInfo | null;
}

const InvoicePreviewModal = ({
  open,
  onCancel,
  invoiceDetails,
}: InvoicePreviewModalProps) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      className="app-modal"
      style={{ minWidth: "40%" }}
    >
      <div className="py-8 px-3">{invoiceDetails?.fileName}</div>
    </Modal>
  );
};

export default InvoicePreviewModal;
