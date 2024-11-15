import React, { useState } from "react";
import { Input, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import AppButton from "../../../components/AppButton";
import PageHeader from "../../../components/PageHeader";
import { useNavigate } from "react-router-dom";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
    setIsButtonDisabled(value.length < 2);
  };

  return (
    <div className="flex flex-col items-start min-h-screen font-inter">
      <PageHeader previousPage="Home" currentPage="New Project" />

      <div className="flex flex-col items-center w-full p-6">
        <h2 className="text-black text-[6] text-[24px] mb-6">
          Name your project
        </h2>

        <div className="flex flex-col w-[50%] mb-6">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-gray-700 align-middle">Project name</label>
            <Tooltip title="Enter the name of your project">
              <InfoCircleOutlined className="text-gray-500" />
            </Tooltip>
          </div>
          <div className="flex flex-col items-center space-y-6">
            <Input
              placeholder="e.g Comparison Report"
              value={projectName}
              onChange={handleInputChange}
              className="px-[12px] py-[8px] h-[40px] rounded-sm border-[#D9D9D9] "
            />

            <AppButton
              disabled={isButtonDisabled}
              onClick={() =>
                navigate(`/upload-files?projectName=${projectName}`)
              }
            >
              Save
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
