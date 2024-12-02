import { Card, Image, notification } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useFileProcessor } from "../../../../context/FileProcessorContext";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import FeatureCard from "../components/FeatureCard";
import {
  fieldExtractionFeatures,
  generateInsightFeatures,
  imageProcessingFeatures,
} from "../constants";

const TextExtraction = ({
  setActiveKey,
}: {
  setActiveKey: (key: string) => void;
}) => {
  const { currentProject, projects } = useFileProcessor();
  const [fileSize, setFileSize] = useState<string>("0");
  const [blob, setBlob] = useState<Blob | null>();
  const navigate = useNavigate();

  useEffect(() => {
    const projectData = projects.find(
      (project) => project.id === currentProject?.id
    );

    if (!projectData) {
      navigate("/home");
      notification.error({
        message: "Project not found, Create a project first",
      });
    }

    const extractedTextArray = projectData?.files_data.files.map((file) => ({
      file_name: file.file_name,
      content: file.content,
    }));
    if (extractedTextArray) {
      const jsonString = JSON.stringify(extractedTextArray, null, 4);
      const blob = new Blob([jsonString], { type: "application/json" });
      setBlob(blob);
      setFileSize((blob.size / 1024).toFixed(2));
    }
  }, []);

  const handleDownload = () => {
    if (blob) {
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = `${currentProject?.name?.replace(/\s+/g, "-")}.json`;
      link.click();
    }
  };

  return (
    <>
      <div className="flex flex-start">
        <div className="flex justify-center items-center pt-6 ">
          <Card
            className="min-w-[240px] border-1 border-[#F0F0F0] rounded-none"
            bodyStyle={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              padding: 0,
            }}
          >
            <div className="w-full h-[121px] flex justify-center items-center bg-[#F0F0F0]">
              <Image src="/assets/icons/file.svg" alt="file icon" />
            </div>

            <div className="p-4 font-inter text-sm border-b border-1 w-full border-[#F0F0F0]">
              <p className="text-dark-gray font-medium mb-2">
                {`${currentProject?.name}.JSON`}
              </p>
              <p className="text-gray">{fileSize} KB</p>
            </div>

            <div
              className="p-3 cursor-pointer w-full flex justify-center hover:text-white hover:bg-deep-blue"
              onClick={handleDownload}
            >
              <DownloadOutlined className="text-[20px] text-gray-600" />
            </div>
          </Card>
        </div>
      </div>
      <div className="border-b-[0.5px] border-[#0000000F] mt-10 mb-6 w-full"></div>
      <div className="font-inter text-black text-opacity-85">
        <h5 className="text-[16px] font-medium mb-1">Explore more options</h5>
        <p className="text-[14px] font-normal">
          Select the option you would like to perform
        </p>
        <div className="flex flex-col md:flex-row items-stretch justify-start gap-6 mt-6 mb-6">
          <FeatureCard
            title="Field Extraction"
            features={fieldExtractionFeatures}
            iconSrc="/assets/icons/field.svg"
            onClick={() => setActiveKey("2")}
          />
          <FeatureCard
            title="Generate Insight"
            features={generateInsightFeatures}
            iconSrc="/assets/icons/insight.svg"
            onClick={() => setActiveKey("3")}
          />
          <FeatureCard
            title="Image Processing"
            features={imageProcessingFeatures}
            iconSrc="/assets/icons/image.svg"
            onClick={() => setActiveKey("4")}
          />
        </div>
      </div>
    </>
  );
};

export default TextExtraction;
