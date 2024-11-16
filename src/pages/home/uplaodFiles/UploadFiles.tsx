import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { Upload, message } from "antd";
import {
  InboxOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AppButton from "../../../components/AppButton";

const UploadFiles = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const projectName = queryParams.get("projectName");

  const { Dragger } = Upload;
  const [fileList, setFileList] = useState<any[]>([]);
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  console.log(fileList);

  useEffect(() => {
    if (!projectName) navigate("/");
  }, [projectName, navigate]);

  useEffect(() => {
    const allUploaded = fileList.every((file) => file.status === "done");
    setAllFilesUploaded(allUploaded);
  }, [fileList]);

  console.log(fileList);

  const handleExtraction = () => {
    // setIsLoading(true);

    navigate(`/process-files?projectName=${projectName}`);
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList,
    customRequest(info: any) {
      setFileList(info.fileList);

      fileList.forEach((file: any) => {
        const { status, name } = file;

        if (status === "done") {
          message.success(`${name} file uploaded successfully.`);
        } else if (status === "error") {
          message.error(`${name} file upload failed.`);
        }
      });
    },
    beforeUpload(file: File) {
      setFileList((prevFiles) => [
        ...prevFiles,
        { name: file.name, status: "uploading", percent: 0 },
      ]);

      return false;
    },

    onDrop(e: any) {
      console.log("Dropped files:", e.dataTransfer.files);
    },

    showUploadList: false,
  };

  const handleDelete = (fileName: string) => {
    setFileList((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  return (
    <div className="flex flex-col items-start min-h-screen font-inter">
      <PageHeader previousPage="Home" currentPage={projectName as string} />

      <div className="flex flex-col items-center w-full p-6">
        <div className="w-9/12">
          <h2 className="text-black text-[24px] text-center mb-6">
            File Upload
          </h2>
          <Dragger
            {...uploadProps}
            className="bg-transparent text-center rounded-lg"
            style={{
              border: "1px solid #D9D9D9",
            }}
          >
            <div className="flex justify-center items-center gap-10 font-inter">
              <InboxOutlined className="text-deep-blue text-5xl" />
              <div className="flex flex-col items-start">
                <p className="text-dark-gray mb-2 text-[16px] font-medium">
                  Select or drag file(s) from computer
                </p>
                <p className="text-dark-gray text-[14px]">
                  Supports PDF, CSV, XLS, and DOCX files up to 200MB.
                </p>
              </div>
            </div>
          </Dragger>

          <div className="mt-6">
            {fileList.map((file) => (
              <div
                key={file.uid}
                className="relative flex items-center my-2 px-4 py-2"
                style={{
                  border: "1px solid #E0E0E0",
                  borderRadius: "5px",
                  background:
                    file.status === "uploading"
                      ? `linear-gradient(to right, #4caf50 ${
                          file.percent || 0
                        }%, transparent ${file.percent || 0}%)`
                      : "#FFFFFF",
                  transition: "background 0.3s ease",
                }}
              >
                <PaperClipOutlined className="text-gray-500 text-lg mr-3" />
                <span className="text-black font-medium flex-1">
                  {file.name}
                </span>

                {file.status === "uploading" && (
                  <span className="flex items-center text-gray italic mr-3">
                    Uploading...
                  </span>
                )}

                {file.status === "done" && (
                  <span className="flex items-center text-gray italic mr-3">
                    Upload complete
                    <CheckCircleOutlined className="ml-2 text-green-600" />
                  </span>
                )}

                <DeleteOutlined
                  className="text-red-500 cursor-pointer"
                  onClick={() => handleDelete(file.name)}
                />
              </div>
            ))}
          </div>

          {fileList.length > 0 && (
            <AppButton
              className="mt-5"
              disabled={false}
              onClick={handleExtraction}
              loading={isLoading}
              width="80%"
            >
              Extract
            </AppButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadFiles;
