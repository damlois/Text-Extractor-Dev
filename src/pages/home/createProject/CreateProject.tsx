import React, { useState } from "react";
import { Input, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import AppButton from "../../../components/AppButton";
import PageHeader from "../../../components/PageHeader";
import { useNavigate } from "react-router-dom";
import AppInput from "../../../components/AppInput";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
  };

  return (
    <div className="flex flex-col items-start min-h-screen font-inter">
      <PageHeader previousPage="Home" currentPage="New Project" />

      <div className="flex flex-col items-center w-full p-6">
        <h2 className="text-black text-[6] text-[24px]">Name your project</h2>

        <div className="flex flex-col w-[50%] mb-6">
          <AppInput
            label="Project name"
            tooltip="Enter the name of your project"
            placeholder="e.g Comparison Report"
            onChange={handleInputChange}
          />
          <div className="flex flex-col items-center mt-6">
            <AppButton
              disabled={projectName.length < 2}
              onClick={() =>
                navigate(`/upload-files?projectName=${projectName}`)
              }
            >
              Save and Proceed
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
