import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { Upload, message } from "antd";
import {
  InboxOutlined,
  PaperClipOutlined,
  DeleteOutlined,
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
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0); // Add state for progress

  useEffect(() => {
    if (!currentProject) navigate("/home");
  }, []);

  // const handleExtraction = async () => {
  //   try {
  //     setLoading(true);
  //     await uploadFiles(fileList.map((file) => file.originFileObj));
  //     setLoading(false);
  //     showNotification("success", `Extraction done successfuly!`);
  //     navigate(`/home/process-files`);
  //   } catch (error) {
  //     setLoading(false);
  //     showNotification(
  //       "error",
  //       "Text extraction failed",
  //       "There was an issue extracting your data. Please try again."
  //     );
  //   }
  // };

  const handleExtraction = async () => {
    try {
      setLoading(true);
      setProgress(0); // Reset progress at the start

      // Simulate progress over time (e.g., 10 seconds to simulate the extraction)
      const totalDuration = 10000; // 10 seconds for the simulation
      const progressInterval = 100; // Update every 100ms

      // Start interval to simulate progress
      const intervalId = setInterval(() => {
        setProgress((prevProgress) => {
          if (prevProgress >= 100) {
            clearInterval(intervalId); // Clear interval when progress reaches 100
            return 100;
          }
          return prevProgress + (100 / (totalDuration / progressInterval)); // Increase progress
        });
      }, progressInterval);

      // Call the uploadFiles function after the interval starts
      await uploadFiles(fileList.map((file) => file.originFileObj));

      // Once files are uploaded, stop the loading state and show success
      setLoading(false);
      clearInterval(intervalId); // Ensure interval is cleared if the upload finishes before progress hits 100
      setProgress(100); // Ensure we set progress to 100% at the end
      showNotification("success", `Extraction done successfully!`);
      navigate(`/home/process-files`);
    } catch (error) {
      setLoading(false);
      setProgress(0); // Reset progress if error occurs
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
      const MAX_TOTAL_SIZE_MB = 200;
      const MAX_FILE_SIZE_MB = 200;

      const totalSize = fileList.reduce(
        (acc, currentFile) => acc + currentFile.originFileObj.size,
        0
      );

      const newTotalSize = totalSize + file.size;

      if (file.size / 1024 / 1024 > MAX_FILE_SIZE_MB) {
        message.error(`${file.name} exceeds the 200MB size limit.`);
        return Upload.LIST_IGNORE;
      }

      if (newTotalSize / 1024 / 1024 > MAX_TOTAL_SIZE_MB) {
        message.error(`Total file size cannot be more than 200MB.`);
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
