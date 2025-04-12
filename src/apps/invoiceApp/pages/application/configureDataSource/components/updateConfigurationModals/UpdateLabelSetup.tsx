import { useState } from "react";
import SuccessModal from "../../../../../../../components/SuccessModal";
import { Modal } from "antd";
import LabelSetupTemplate from "../../templates/LabelSetupTemplate";
import AppButton from "../../../../../../../components/AppButton";
import { useTemplate } from "../../../../../context/TemplateContext";
import { handleError } from "../../../../../../../utils/notification";

interface UpdateLabelSetupProps {
  open: boolean;
  onCancel: () => void;
  refreshPage: () => void;
}

const UpdateLabelSetup = ({
  open,
  onCancel,
  refreshPage,
}: UpdateLabelSetupProps) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const { saveTemplate } = useTemplate();

  const toggleSuccessModal = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const handleUpdate = async () => {
    try {
      await saveTemplate();
      onCancel();
      toggleSuccessModal();
    } catch (error) {
handleError(error, 'Template')    }
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        className="app-modal"
        style={{ minWidth: "80%" }}
      >
        <div className="w-full relative">
          <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
            Update Field Extraction
          </div>
          <LabelSetupTemplate
            className="px-6 pt-6"
            buttonComponent={({ loading }) => (
              <div className="border-t border-[#f0f0f0]">
                <div className="flex flex-end gap-2 p-6">
                  <AppButton
                    variant="secondary"
                    width="fit-content"
                    className="mr-0"
                    onClick={onCancel}
                    disabled={loading}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    htmlType="submit"
                    width="fit-content"
                    className="ml-0 mr-0"
                    loading={loading}
                    onClick={handleUpdate}
                  >
                    Update
                  </AppButton>
                </div>
              </div>
            )}
          />
        </div>
      </Modal>
      <SuccessModal
        onCancel={toggleSuccessModal}
        open={showSuccessModal}
        title="Fields Updated Successfully"
        subtitle="You will be automatically redirected to the main page."
        refreshPage={refreshPage}
      />
    </>
  );
};

export default UpdateLabelSetup;
