import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface ArchiveDuplicatesModalProps {
  open?: boolean;
  onCancel: () => void;
}

const ArchiveDuplicatesModal = ({
  open,
  onCancel,
}: ArchiveDuplicatesModalProps) => {
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
