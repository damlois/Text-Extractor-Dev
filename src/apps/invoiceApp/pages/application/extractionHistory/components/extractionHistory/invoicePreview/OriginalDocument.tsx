import { InfoCircleOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { useState, useRef } from "react";

const OriginalDocument = ({ pages }: { pages: { image_data: string }[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const childHeight = containerRef.current.scrollHeight / pages.length;
      const page = Math.ceil((scrollTop + 1) / childHeight);
      setCurrentPage(page);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-[18px] py-[12px] text-[16px] font-bold text-dark-gray bg-[#F9FAFB] rounded-t-[8px] flex justify-between flex-wrap items-center">
        <div>
          Original Document
          <Tooltip title="This is the uploaded file used for data extraction. You can refer to it to verify the accuracy of the extracted information.">
            <InfoCircleOutlined className="text-[#00000073] cursor-pointer ml-[6px]" />
          </Tooltip>
        </div>
        <span className="text-[12px]">
          Page {currentPage} / {pages.length}
        </span>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="py-[18px] px-[12px] border border-[#F1F1F1] overflow-y-auto h-[80vh]"
      >
        {pages.map((page, idx) => (
          <div key={idx} className="mb-4">
            <img
              src={`data:image/jpeg;base64,${page.image_data}`}
              alt={`Invoice Page ${idx + 1}`}
              className="w-full rounded border-t border-[#E5E7EB80]"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default OriginalDocument;
