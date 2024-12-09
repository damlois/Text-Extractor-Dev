import { useEffect, useState } from "react";
import { Tabs } from "antd";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { useFileProcessor } from "../../../context/FileProcessorContext";
import { FieldExtraction } from "./tabs/fieldExtraction";
import { GenerateInsight } from "./tabs/generateInsight";
import { ImageProcessing } from "./tabs/imageProcessing";
import { TextExtraction } from "./tabs/textExtraction";

const ProcessFiles = () => {
  const navigate = useNavigate();
  const { currentProject } = useFileProcessor();

  const [activeKey, setActiveKey] = useState("1");

  const handleTabChange = (key: string) => {
    setActiveKey(key);
  };

  useEffect(() => {
    if (!currentProject) navigate("/home");
  }, []);

  const tabItems = [
    { key: "1", label: "Text Extraction" },
    { key: "2", label: "Field Extraction" },
    { key: "3", label: "Generate Insight" },
    { key: "4", label: "Image Processing" },
  ];

  const pages = [
    <TextExtraction setActiveKey= {setActiveKey}/>,
    <FieldExtraction />,
    <GenerateInsight />,
    <ImageProcessing />,
  ];

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader
        previousPage="Home"
        currentPage={currentProject?.name as string}
        noBorder
      />

      <div className="flex flex-col items-center w-full py-2">
        <div className="w-full border-b border-[#F0F0F0]">
          <Tabs
            activeKey={activeKey}
            onChange={handleTabChange}
            items={tabItems}
            className="custom-tabs font-inter text-dark-gray px-6 bo"
          />
        </div>
      </div>

      <div className="p-6 w-full">{pages[Number(activeKey) - 1]}</div>
    </div>
  );
};

export default ProcessFiles;
