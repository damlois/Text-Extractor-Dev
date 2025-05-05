import { Button, Modal } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";

interface DocumentInReviewModalProps {
  open?: boolean;
  onCancel: () => void;
}

const DocumentInReviewModal = ({
  open,
  onCancel,
}: DocumentInReviewModalProps) => {
  return (
    <Modal
      title={
        <div className="flex items-center text-[16px] text-dark-gray font-medium">
          <InfoCircleOutlined className="text-deep-blue mr-4 text-[22px]" />
          Document In Review
        </div>
      }
      open={open}
      onCancel={onCancel}
      footer={[
        <Button
          key="cancel"
          onClick={onCancel}
          className="h-[32px] px-[15px] mt-[12px] rounded-[2px]"
        >
          Cancel
        </Button>,
      ]}
      width={471}
      centered
      styles={{
        content: { padding: "16px", borderRadius: "2px" },
      }}
    >
      <p className="text-dark-gray text-sm font-normal ml-[38px]">
        This document is currently being reviewed by another person. <br />{" "}
        <br />
        You won’t be able to make changes or take action until their review is
        complete.
      </p>
    </Modal>
  );
};

export default DocumentInReviewModal;
