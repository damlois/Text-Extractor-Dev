import { Modal } from "antd";
import AppButton from "../../../../../../components/AppButton";
import { useState } from "react";

const DeactivateRow = () => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);

  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const handleDeactivate = () => {
    toggleModal();
  };

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 w-full">
      <div className="lg:w-[35%] md-w-full">
        <h2 className="text-dark-gray font-bold text-[16px]">
          Deactivate Data Source
        </h2>
        <p className="text-gray font-normal text-[14px]">
          Warning!! This action will remove the data source and all associated
          configurations.
        </p>
      </div>
      <AppButton
        onClick={toggleModal}
        children="Deactivate Data Source"
        width="fit-content"
        className="ml-0"
      />
      <Modal
        open={showConfirmationModal}
        onCancel={toggleModal}
        footer={null}
        className="app-modal"
        style={{ minWidth: "35%" }}
        closable={false}
      >
        <div className="text-dark-gray px-8 pt-8 pb-6">
          <p className="text-[16px] font-medium mb-2">Deactivate Data Source</p>
          <p className="text-[14px] font-normal mb-4">
            Are you sure you want to deactivate this data source? Remember, this
            action cannot be undone.
          </p>
          <div className="flex gap-2 flex-end">
            <AppButton width="fit-content" className="mr-0" variant="secondary" onClick={handleDeactivate}>
              Cancel
            </AppButton>
            <AppButton
              width="fit-content"
              className="ml-0 mr-0"
              onClick={handleDeactivate}
            >
              Yes, I am sure
            </AppButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default DeactivateRow;
