import { Modal } from "antd";
import AppButton from "../../../../../../../components/AppButton";
import { useState } from "react";
import { DataSourceDetails } from "../../../../../../../types";
import { invoiceProcessorApi } from "../../../../../../../api/invoice-api";
import SuccessModal from "../../../../../../../components/SuccessModal";
import { handleError } from "../../../../../../../utils/notification";

interface DeactivateRowProps {
  dataSourceDetails: DataSourceDetails | null;
  refreshPage: () => void;
}

const DeactivateRow = ({
  dataSourceDetails,
  refreshPage,
}: DeactivateRowProps) => {
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [loading, setLoading] = useState(false);

  const toggleModal = () => {
    setShowConfirmationModal(!showConfirmationModal);
  };

  const handleToggleStatus = async () => {
    if (!dataSourceDetails?.id) return;

    setLoading(true);
    try {
      const newStatus =
        dataSourceDetails.status === "active" ? "inactive" : "active";
      await invoiceProcessorApi.toggleDataSourceStatus(
        dataSourceDetails.id,
        newStatus
      );
    } catch (error) {
      handleError(error)
    } finally {
      setLoading(false);
      toggleModal();
      setShowSuccessModal(!showSuccessModal);
    }
  };

  const isActive = dataSourceDetails?.status === "active";

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 w-full">
      <div className="lg:w-[35%] md-w-full">
        <h2 className="text-dark-gray font-bold text-[16px]">
          {isActive ? "Deactivate" : "Activate"} Data Source
        </h2>
        <p className="text-gray font-normal text-[14px]">
          {isActive
            ? "Warning!! This action will deactivate the data source and pause all associated configurations."
            : "This action will reactivate the data source and resume all associated configurations."}
        </p>
      </div>
      <AppButton
        onClick={toggleModal}
        loading={loading}
        width="fit-content"
        className="ml-0"
      >
        {isActive ? "Deactivate" : "Activate"} Data Source
      </AppButton>
      <Modal
        open={showConfirmationModal}
        onCancel={toggleModal}
        footer={null}
        className="app-modal"
        style={{ top: "30%" }}
        closable={false}
      >
        <div className="text-dark-gray px-8 pt-8 pb-6">
          <p className="text-[16px] font-medium mb-2">
            {isActive ? "Deactivate" : "Activate"} Data Source
          </p>
          <p className="text-[14px] font-normal mb-4">
            Are you sure you want to {isActive ? "deactivate" : "activate"} this
            data source?
            {isActive && " Remember, this action can be reversed later."}
          </p>
          <div className="flex gap-2 flex-end">
            <AppButton
              width="fit-content"
              className="mr-0"
              variant="secondary"
              onClick={toggleModal}
            >
              Cancel
            </AppButton>
            <AppButton
              width="fit-content"
              className="ml-0 mr-0"
              loading={loading}
              onClick={handleToggleStatus}
            >
              Yes, I am sure
            </AppButton>
          </div>
        </div>
      </Modal>
      <SuccessModal
        onCancel={() => setShowSuccessModal(!showSuccessModal)}
        open={showSuccessModal}
        title={`Data Source ${
          isActive ? "Deactivated" : "Activated"
        } Successfully`}
        subtitle="You will be automatically redirected to the main page."
        refreshPage={refreshPage}
      />
    </div>
  );
};

export default DeactivateRow;
