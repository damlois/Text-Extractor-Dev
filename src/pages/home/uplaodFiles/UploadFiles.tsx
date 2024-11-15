import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { useEffect } from "react";

const UploadFiles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get("projectName");

  useEffect(() => {
    if (!projectName) navigate("/");
  }, [])

  return (
    <div className="flex flex-col items-start min-h-screen font-inter">
      <PageHeader previousPage="Home" currentPage={projectName as string} />

      <div className="flex flex-col items-center w-full p-6">
        Upload files oooo
      </div>
    </div>
  );
};

export default UploadFiles;
