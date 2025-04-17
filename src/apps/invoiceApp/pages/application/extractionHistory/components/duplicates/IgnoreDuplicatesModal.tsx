import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import {
  handleError,
  showNotification,
} from "../../../../../../../utils/notification";
import { useState } from "react";

interface IgnoreDuplicatesModalProps {
  open?: boolean;
  onCancel: () => void;
  selectedInvoiceIds: Record<string, string[]>;
  pageRefresh: () => void;
  selectedCount: number;
}

const IgnoreDuplicatesModal = ({
  open,
  onCancel,
  selectedInvoiceIds,
  pageRefresh,
  selectedCount,
}: IgnoreDuplicatesModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleIgnore = async () => {
    try {
      setLoading(true);
      await invoiceProcessorApi.updateInvoiceStatus(
        "ignore",
        Object.values(selectedInvoiceIds).flat()
      );

      onCancel();
      pageRefresh();
      showNotification(
        "success",
        selectedCount > 1
          ? "Selected invoices have been successfully ignored"
          : "Selected invoice has been successfully ignored"
      );
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <InfoCircleOutlined className="text-deep-blue mr-4 text-[22px]" />
          {selectedCount > 1
            ? "Ignore these duplicates?"
            : "Ignore this duplicate?"}
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
          {`Ignore Duplicate${selectedCount > 1 ? "s" : ""}`}
        </Button>,
      ]}
      width={471}
      centered
      styles={{
        content: { padding: "16px", borderRadius: "2px" },
      }}
    >
      {selectedCount > 1 ? (
        <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
          If you ignore these duplicates, they will remain in the invoice list
          and won’t be flagged again.
        </p>
      ) : (
        <p className="text-dark-gray text-sm font-normal ml-[38px] mb-6">
          If you ignore this duplicate, it will remain in the invoice list and
          won’t be flagged again.
        </p>
      )}
    </Modal>
  );
};

export default IgnoreDuplicatesModal;
