import { Card, Image } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const TextExtraction = () => {
  return (
    <div className="flex flex-start">
      <div className="flex justify-center items-center pt-6 ">
        <Card
          className="w-[24opx] border-1 border-[#F0F0F0] rounded-none"
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

          <div className="p-4 font-inter text-sm border-b border-1 border-[#F0F0F0]">
            <p className="text-dark-gray font-medium mb-2">
              Contract Comparison 2024.JSON
            </p>
            <p className="text-gray">5MB</p>
          </div>

          <div className="p-3 cursor-pointer w-full flex justify-center">
            <DownloadOutlined className="text-[20px] text-gray-600 hover:text-gray-900r" />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default TextExtraction;
