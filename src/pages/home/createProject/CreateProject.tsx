import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppButton from "../../../components/AppButton";
import PageHeader from "../../../components/PageHeader";
import AppInput from "../../../components/AppInput";
import { useCreateProject } from "../../../hooks/useFileProcessor";
import { showNotification } from "../../../utils/notification";

const CreateProject = () => {
  const [projectName, setProjectName] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { createProject } = useCreateProject();
  const description = "";

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProjectName(value);
  };

  const handleCreateProject = async () => {
    try {
      setLoading(true);
      const data = await createProject({ name: projectName, description });
      setLoading(false);
      showNotification(
        "success",
        `Project "${data.name}" Created Successfully!`,
        "Your project has been created and you can now upload files."
      );
      navigate(`/home/upload-files`);
    } catch (error) {
      setLoading(false);
      showNotification(
        "error",
        "Project Creation Failed",
        "There was an issue creating your project. Please try again."
      );
    }
  };

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader previousPage="Home" currentPage="New Project" />

      <div className="flex flex-col items-center w-full p-6">
        <h2 className="text-black text-[24px] mb-6">Name Your Project</h2>

        <div className="flex flex-col sm:w-[80%] md:w-[50%] mb-6">
          <AppInput
            label="Project Name"
            tooltip="Choose a unique name for your project to easily identify and reuse it later"
            placeholder="e.g Comparison Report"
            onChange={handleInputChange}
            onPressEnter={handleCreateProject}
            required
          />
          <div className="flex flex-col items-center mt-6">
            <AppButton
              disabled={projectName.length < 2}
              onClick={handleCreateProject}
              loading={loading}
            >
              Save and Proceed
            </AppButton>
          </div>
        </div>

        <div className="border-b-[0.5px] border-[#0000000F] mt-10 w-full"></div>
      </div>
    </div>
  );
};

export default CreateProject;
