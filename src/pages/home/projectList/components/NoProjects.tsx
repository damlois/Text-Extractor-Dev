import { Image } from "antd";
import AppButton from "../../../../components/AppButton";
import { useNavigate } from "react-router-dom";

const NoProjects = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center mt-6">
      <Image
        src="/assets/icons/upload.png"
        preview={false}
        alt="create new project"
        width="238px"
        height="235px"
      />
      <div className="font-inter text-[14px] m-4">
        Click the button below to begin a new project
      </div>
      <AppButton
        onClick={() => navigate("/home/create-project")}
        width="133px"
        className="mb-8"
      >
        + New Project
      </AppButton>
    </div>
  );
};

export default NoProjects;
