import { Modal } from "antd";
import React from "react";
import AppButton from "../../../../../components/AppButton";

interface ConfirmLeaveModalProps {
  open: boolean;
  isEditState: boolean;
  onCancel: () => void;
  onConfirmLeave?: () => void;
  onApproveQA?: () => void;
  onSaveChanges?: () => void;
}

const ConfirmLeaveModal: React.FC<ConfirmLeaveModalProps> = ({
  open,
  isEditState,
  onCancel,
  onConfirmLeave,
  onApproveQA,
  onSaveChanges,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title={
        isEditState
          ? "Leave Without Saving Changes?"
          : "Leave Without Approving QA?"
      }
      centered
    >
      <p>
        {isEditState ? (
          <>
            You haven't saved your changes yet. If you leave now, any unsaved
            progress may be lost. <br />
            <br /> Are you sure you want to continue?
          </>
        ) : (
          "You haven't approved the QA. Are you sure you want to leave this page?"
        )}
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

        {isEditState ? (
          <AppButton onClick={onSaveChanges}> Save Changes </AppButton>
        ) : (
          <AppButton onClick={onApproveQA}>Approve QA</AppButton>
        )}
      </div>
    </Modal>
  );
};

export default ConfirmLeaveModal;
