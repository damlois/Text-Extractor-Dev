import { Modal } from "antd";
import React from "react";
import AppButton from "../../../../../components/AppButton";

interface SaveChangesModalProps {
  open: boolean;
  laodingSave: boolean;
  onCancel: () => void;
  onSaveChanges?: () => void;
}

const SaveChangesModal: React.FC<SaveChangesModalProps> = ({
  open,
  laodingSave,
  onCancel,
  onSaveChanges,
}) => {
  return (
    <Modal
      open={open}
      onCancel={onCancel}
      footer={null}
      title="Confirm Save & Pass"
      centered
    >
      <p>
        You're making changes to the content. Once you save, it will
        automatically pass the QA process. <br />
        <br /> Please confirm to continue.
      </p>
      <div className="flex justify-end gap-2 mt-6">
        <AppButton variant="secondary" onClick={onCancel}>
          Cancel
        </AppButton>

        <AppButton
          onClick={() => {
            onSaveChanges?.();
          }}
          loading={laodingSave}
        >
          Save and Continue
        </AppButton>
      </div>
    </Modal>
  );
};

export default SaveChangesModal;
