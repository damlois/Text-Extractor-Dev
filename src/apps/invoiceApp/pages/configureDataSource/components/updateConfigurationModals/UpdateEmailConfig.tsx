import { Modal } from "antd";
import EmailConfigTemplate from "../../templates/EmailConfigTemplate";
import AppButton from "../../../../../../components/AppButton";
import SuccessModal from "../../../../../../components/SuccessModal";
import { useState } from "react";
import { DataSourceDetails } from "../../../../../../types";

interface UpdateEmailConfigProps {
  open: boolean;
  onCancel: () => void;
  dataSourceDetails: DataSourceDetails | null;
}

const UpdateEmailConfig = ({
  open,
  onCancel,
  dataSourceDetails,
}: UpdateEmailConfigProps) => {
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const toggleSuccessModal = () => {
    setShowSuccessModal(!showSuccessModal);
  };

  const onSuccessCallBack = () => {
    onCancel();
    toggleSuccessModal();
  };

  return (
    <>
      <Modal
        open={open}
        onCancel={onCancel}
        footer={null}
        className="app-modal"
        style={{ width: "468px" }}
      >
        <div className="w-full relative">
          <div className="text-[20px] font-bold p-6 border-b border-0.5 border-[#cfc1c1]">
            Update Email Configuration
          </div>
          <EmailConfigTemplate
            className="px-6 pt-6"
            initialEmail={dataSourceDetails?.username}
            onSuccessCallback={onSuccessCallBack}
            buttonComponent={({ loading }) => (
              <div className="border-t border-[#f0f0f0]">
                <div className="flex flex-end gap-2 p-6">
                  <AppButton
                    variant="secondary"
                    width="fit-content"
                    className="mr-0"
                    onClick={() => onCancel()}
                  >
                    Cancel
                  </AppButton>
                  <AppButton
                    htmlType="submit"
                    width="fit-content"
                    className="ml-0 mr-0"
                    loading={loading}
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
        onCancel={() => toggleSuccessModal()}
        open={showSuccessModal}
        title="Email Address Updated Successfully"
        subtitle="You will be automatically redirected to the main page."
      />
    </>
  );
};

export default UpdateEmailConfig;
