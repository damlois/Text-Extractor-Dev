import { ArrowLeftOutlined } from "@ant-design/icons";
import React from "react";
import { useNavigate } from "react-router-dom";
import LabelSetupTemplate from "./templates/LabelSetupTemplate";
import AppButton from "../../../../../components/AppButton";
import { useTemplate } from "../../../context/TemplateContext";
import { showNotification } from "../../../../../utils/notification";

const SetupLabel: React.FC = () => {
  const navigate = useNavigate();
  const { saveTemplate } = useTemplate();

  const handleContinue = async () => {
    try {
      await saveTemplate();
      showNotification("success", "Template saved successfully");
      navigate("../data-source");
    } catch (error) {
      showNotification("error", "Failed to save template");
    }
  };

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
      <LabelSetupTemplate
        buttonComponent={({ loading }) => (
          <AppButton width="70%" onClick={handleContinue} loading={loading}>
            Continue
          </AppButton>
        )}
      />
    </div>
  );
};

export default SetupLabel;
