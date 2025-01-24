import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import LabelSetupTemplate from "./components/features/LabelSetupTemplate";
import AppButton from "../../../../components/AppButton";

const SetupLabel: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full relative">
      <div
        className="mt-[10px] text-deep-blue px-[0] cursor-pointer absolute"
        onClick={() => navigate("../data-source/connect-email")}
      >
        <ArrowLeftOutlined className="mr-6" /> Back
      </div>
      <div className="lg:w-4/12 md:w-7/12 sm:w-10/12 mx-auto relative">
        <div className="mb-6">
          <h2 className="text-dark-gray text-[24px] text-center">
            Field Extraction Setup
          </h2>
          <p className="text-gray text-center ">
            Review the field to extract in your invoice or add for better
            customization
          </p>
        </div>
      </div>
      <LabelSetupTemplate buttonComponent={<AppButton width="70%" onClick={() => navigate("../data-source")}>Continue</AppButton>} />
    </div>
  );
};

export default SetupLabel;
