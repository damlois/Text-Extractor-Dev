import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input, Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import AppButton from "../../../components/AppButton";
import PageHeader from "../../../components/PageHeader";
import AppInput from "../../../components/AppInput";
import { useCreateProject } from "../../../hooks/useFileProcessor";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const navigate = useNavigate();
  const createProject = useCreateProject();
  const description = "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
  };

  const handleCreateProject = () => {
    createProject.mutate(
      { name: projectName, description },
      {
        onSuccess: (data) => {
          navigate(`/upload-files?projectName=${data.name}`);
        },
      }
    );
  };

  return (
    <div className="flex flex-col items-start min-h-screen font-inter">
      <PageHeader previousPage="Home" currentPage="New Project" />

      <div className="flex flex-col items-center w-full p-6">
        <h2 className="text-black text-[24px]">Name your project</h2>

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
              onClick={handleCreateProject}
              loading={createProject.status === 'pending'}
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
