import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { showNotification } from "../../../../../../../utils/notification";
import { useState } from "react";

interface ArchiveDuplicatesModalProps {
  open?: boolean;
  onCancel: () => void;
  selectedInvoiceIds: Record<string, string[]>;
  pageRefresh: () => void;
}

const ArchiveDuplicatesModal = ({
  open,
  onCancel,
  selectedInvoiceIds,
  pageRefresh,
}: ArchiveDuplicatesModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleArchive = async () => {
    try {
      setLoading(true);
      await invoiceProcessorApi.updateInvoiceStatus(
        "archive",
        Object.values(selectedInvoiceIds).flat()
      );

      onCancel();
      pageRefresh();
      showNotification(
        "success",
        "Selected invoices have been successfully archived"
      );
    } catch {
      showNotification(
        "error",
        "Something went wrong. Please check your internet connection and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <InfoCircleOutlined className="text-deep-blue mr-4 text-[22px]" />
          Are you sure you want to archive selected duplicate invoices?{" "}
        </div>
      }
      open={open}
      closable={false}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="h-[32px] px-[15px] rounded-[2px]"
        >
          Cancel
        </Button>,
        <Button
          key="ignore-duplicates"
          type="primary"
          className="h-[32px] px-[15px] rounded-[2px]"
          onClick={handleArchive}
          loading={loading}
        >
          Yes, Archive
        </Button>,
      ]}
      width={471}
      centered
      styles={{
        content: { padding: "16px", borderRadius: "2px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
        This action will move the selected duplicate invoices to the archive.
        You can restore them later if needed.
      </p>
    </Modal>
  );
};

export default ArchiveDuplicatesModal;
