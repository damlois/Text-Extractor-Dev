import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { Upload, message } from "antd";
import {
  InboxOutlined,
  PaperClipOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import AppButton from "../../../components/AppButton";
import { useUploadFiles } from "../../../hooks/useFileProcessor";
import { showNotification } from "../../../utils/notification";
import { useFileProcessor } from "../../../context/FileProcessorContext";
import ProgressDoughnut from "../../../components/ProgressDoughnut";

const UploadFiles = () => {
  const navigate = useNavigate();
  const { currentProject } = useFileProcessor();
  const { uploadFiles } = useUploadFiles();

  const { Dragger } = Upload;

  const [fileList, setFileList] = useState<any[]>([]);
  const [allFilesUploaded, setAllFilesUploaded] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentProject) navigate("/home");
  }, []);

  useEffect(() => {
    const allUploaded = fileList.every((file) => file.status === "done");
    setAllFilesUploaded(allUploaded);
  }, [fileList]);

  const handleExtraction = async () => {
    try {
      setLoading(true);
      await uploadFiles(fileList.map((file) => file.originFileObj));
      setLoading(false);
      showNotification("success", `Extraction done successfuly!`);
      navigate(`/home/process-files`);
    } catch (error) {
      setLoading(false);
      showNotification(
        "error",
        "Text extraction failed",
        "There was an issue extracting your data. Please try again."
      );
    }
  };

  const uploadProps = {
    name: "file",
    multiple: true,
    fileList,
    accept: ".pdf,.csv,.xls,.xlsx,.docx",
    showUploadList: false,

    beforeUpload(file: File) {
      const allowedTypes = [
        "application/pdf",
        "text/csv",
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      const isAllowedType = allowedTypes.includes(file.type);
      if (!isAllowedType) {
        message.error(`${file.name} is not a valid file type.`);
        return Upload.LIST_IGNORE;
      }

      const isUnderSizeLimit = file.size / 1024 / 1024 <= 200;
      if (!isUnderSizeLimit) {
        message.error(`${file.name} exceeds the 200MB size limit.`);
        return Upload.LIST_IGNORE;
      }

      const uid = `${file.name}-${Date.now()}`;
      setFileList((prevFiles) => [
        ...prevFiles,
        {
          uid,
          name: file.name,
          status: "uploading",
          percent: 0,
          originFileObj: file,
        },
      ]);

      return false;
    },

    onChange({ file, fileList }: any) {
      console.log("File added:", file);
      console.log("Updated file list:", fileList);
    },

    onRemove(file: any) {
      setLoading(false);
      setFileList((prevFiles) => prevFiles.filter((f) => f.uid !== file.uid));
    },
  };

  const handleDelete = (fileName: string) => {
    setFileList((prevFiles) =>
      prevFiles.filter((file) => file.name !== fileName)
    );
  };

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader
        previousPage="Home"
        currentPage={currentProject?.name as string}
      />

      <div className="flex flex-col items-center w-full p-6">
        {loading ? (
          <ProgressDoughnut percentage={20} />
        ) : (
          <>
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

                    {/* {file.status === "done" && (
                  <span className="flex items-center text-gray italic mr-3">
                    Uploading...
                  </span>
                )}

                {file.status === "uploading" && (
                  <span className="flex items-center text-gray italic mr-3">
                    Upload complete
                    <CheckCircleOutlined className="ml-2 text-green-600" />
                  </span>
                )} */}

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
                  disabled={allFilesUploaded}
                  onClick={handleExtraction}
                  loading={loading}
                  width="80%"
                >
                  Extract
                </AppButton>
              )}
            </div>

            <div className="border-b-[0.5px] border-[#0000000F] mt-10 w-full"></div>
          </>
        )}
      </div>
    </div>
  );
};

export default UploadFiles;
