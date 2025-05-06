import { Modal } from "antd";
import React from "react";
import AppButton from "../../../../../../../components/AppButton";

interface ApproveQAModalProps {
  open: boolean;
  onCancel: () => void;
  onApproveQA?: () => void;
}

const ApproveQAModal: React.FC<ApproveQAModalProps> = ({
  open,
  onCancel,
  onApproveQA,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Confirm Pass Without Editing?"
      centered
    >
      <p>
        You haven't made any changes to the content. Once you approve, it will
        automatically pass the QA process.
        <br /> <br />
        Are you sure you want to approve without editing?
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <AppButton variant="secondary" onClick={onCancel}>
          Cancel
        </AppButton>

        <AppButton onClick={onApproveQA}>Approve QA</AppButton>
      </div>
    </Modal>
  );
};

export default ApproveQAModal;
