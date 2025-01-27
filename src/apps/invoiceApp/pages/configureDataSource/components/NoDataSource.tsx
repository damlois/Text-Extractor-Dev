import { Image } from "antd";
import { useNavigate } from "react-router-dom";
import AppButton from "../../../../../components/AppButton";

const NoDataSource = () => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center mt-12 w-full">
      <Image
        src="/assets/icons/upload.png"
        preview={false}
        alt="create new project"
        width="238px"
        height="235px"
      />
      <div className="font-inter text-[14px] m-4">
        Click the button below to add a new data source type
      </div>
      <AppButton
        onClick={() => navigate("/invoice-processing/data-source/create")}
        width="fit-content"
        className="mb-8"
      >
        + New Data Source
      </AppButton>
    </div>
  );
};

export default NoDataSource;
