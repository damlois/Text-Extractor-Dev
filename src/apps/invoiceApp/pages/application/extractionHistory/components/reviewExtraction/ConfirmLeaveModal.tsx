import { Modal } from "antd";
import React from "react";
import AppButton from "../../../../../../../components/AppButton";

interface ConfirmLeaveModalProps {
  open: boolean;
  onCancel: () => void;
  onConfirmLeave?: () => void;
  onApproveQA?: () => void;
}

const ConfirmLeaveModal: React.FC<ConfirmLeaveModalProps> = ({
  open,
  onCancel,
  onConfirmLeave,
  onApproveQA,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Leave Without Approving QA?"
      centered
    >
      <p>
        You haven't approved the QA. Are you sure you want to leave this page?
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <AppButton variant="secondary" onClick={onCancel}>
          Stay
        </AppButton>

        <AppButton
          onClick={() => {
            onConfirmLeave?.();
          }}
        >
          Yes, Leave
        </AppButton>

        <AppButton onClick={onApproveQA}>Approve QA</AppButton>
      </div>
    </Modal>
  );
};

export default ConfirmLeaveModal;
