import { EditOutlined } from "@ant-design/icons";
import { useState } from "react";
import UpdateEmailConfig from "../configurationModals/UpdateEmailConfig";
import SuccessModal from "../../../../../../components/SuccessModal";

const EmailConfigRow = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const toggleModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 mb-2 border-b border-[#DBDFEA]">
      <div className="flex flex-wrap gap-x-50 gap-y-4 justify-between items-center">
        <div>
          <h2 className="text-dark-gray font-bold text-[16px]">
            Email Configuration
          </h2>
          <p className="text-gray font-normal text-[14px] w-[90%]">
            Email Address used to configure the data source for invoice
            extraction.
          </p>
        </div>
        <div
          className="edit-config-btn ml-auto text-[14px] text-deep-blue py-1 px-[15px] rounded-sm cursor-pointer"
          onClick={() => toggleModal()}
        >
          <EditOutlined className="pr-[10px]" />
          Edit
        </div>
      </div>
      <div className="flex flex-wrap gap-x-6 gap-y-2 text-dark-gray text-[16px]">
        <p className="w-[160px] font-medium">Email Address</p>
        <p className="font-normal">invoice@company.com</p>
      </div>
      <UpdateEmailConfig
        onCancel={() => toggleModal()}
        open={showUpdateModal}
      />
    </div>
  );
};

export default EmailConfigRow;
