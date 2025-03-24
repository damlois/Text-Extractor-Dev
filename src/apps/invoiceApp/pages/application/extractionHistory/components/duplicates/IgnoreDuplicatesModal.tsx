import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import { showNotification } from "../../../../../../../utils/notification";
import { useState } from "react";

interface IgnoreDuplicatesModalProps {
  open?: boolean;
  onCancel: () => void;
  selectedInvoiceIds: Record<string, string[]>;
  pageRefresh: () => void;
}

const IgnoreDuplicatesModal = ({
  open,
  onCancel,
  selectedInvoiceIds,
  pageRefresh,
}: IgnoreDuplicatesModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleIgnore = async () => {
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
        "Selected invoices have been successfully ignored"
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
          Ignore This Duplicate?
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
          onClick={handleIgnore}
          loading={loading}
        >
          Ignore Duplicate
        </Button>,
      ]}
      width={471}
      centered
      styles={{
        content: { padding: "16px", borderRadius: "2px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
        If you ignore this duplicate, it will remain in the invoice list and
        won’t be flagged again.
      </p>
    </Modal>
  );
};

export default IgnoreDuplicatesModal;
