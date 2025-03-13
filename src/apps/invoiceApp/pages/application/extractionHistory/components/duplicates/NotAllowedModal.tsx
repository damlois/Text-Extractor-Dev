import { Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface NotAllowedModalProps {
  open?: boolean;
  onCancel: () => void;
}

const NotAllowedModal = ({ open, onCancel }: NotAllowedModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <InfoCircleOutlined className="text-deep-blue mr-4 text-[22px]" />
          Not Allowed!
        </div>
      }
      open={open}
      onClose={onCancel}
      footer={false}
      width={416}
      centered
      styles={{
        content: { padding: "16px", borderRadius: "2px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px]">
        You must keep at least one copy. Archiving all files is not allowed.{" "}
      </p>
    </Modal>
  );
};

export default NotAllowedModal;
