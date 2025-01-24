import { EditOutlined } from "@ant-design/icons";
import LabelTag from "../../../../../../components/LabelTag";
import { useState } from "react";
import UpdateLabelSetup from "../configurationModals/UpdateLabelSetup";

const LabelSetupRow = () => {
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const toggleModal = () => {
    setShowUpdateModal(!showUpdateModal);
  };

  return (
    <div className="flex flex-col gap-6 pt-4 pb-6 mb-2 border-b border-[#DBDFEA]">
      <div className="flex flex-wrap gap-x-50 gap-y-4 justify-between items-center">
        <div>
          <h2 className="text-dark-gray font-bold text-[16px]">
            Field Extraction Setup
          </h2>
          <p className="text-gray font-normal text-[14px]">
            List of fields currently added to the setup
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
      <div className="grid gap-y-2 text-dark-gray text-[16px] lg:pr-8 sm:grid-cols-1 lg:grid-cols-[160px_1fr]">
        <p className="font-medium">Field List</p>
        <div className="flex flex-wrap gap-4 items-start">
          {[
            "Invoice Number",
            "Invoice Name",
            "Vendor Name",
            "Vendor Address",
            "Customer Name",
            "SubTotal",
            "Invoice Number",
            "Invoice Name",
            "Vendor Name",
            "Vendor Address",
            "Customer Name",
            "SubTotal",
          ].map((label, index) => (
            <LabelTag
              key={index}
              id={index}
              name={label}
              style={{ padding: "6px 8px" }}
            />
          ))}
        </div>
      </div>
      <UpdateLabelSetup onCancel={() => toggleModal()} open={showUpdateModal} />
    </div>
  );
};

export default LabelSetupRow;
