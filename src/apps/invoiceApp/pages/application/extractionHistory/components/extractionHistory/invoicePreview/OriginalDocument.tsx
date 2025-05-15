import {
  InfoCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import { useState, useRef } from "react";

const OriginalDocument = ({ pages }: { pages: { image_data: string }[] }) => {
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.1));
  const rotateClockwise = () => setRotation((prev) => (prev + 90) % 360);

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
      <div className="px-[18px] py-[12px] text-[16px] font-bold text-dark-gray bg-[#F9FAFB] rounded-t-[8px] flex justify-between flex-wrap items-center border-b border-[#F1F1F1]">
        <div className="flex items-center gap-2">
          Original Document
          <Tooltip title="This is the uploaded file used for data extraction. You can refer to it to verify the accuracy of the extracted information.">
            <InfoCircleOutlined className="text-[#00000073] cursor-pointer ml-[6px]" />
          </Tooltip>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[12px] whitespace-nowrap">
            Page {currentPage} / {pages.length}
          </span>

          <div className="flex items-center gap-1">
            <Tooltip title="Rotate Clockwise">
              <Button
                size="small"
                icon={<ReloadOutlined />}
                onClick={rotateClockwise}
                className="mr-1"
              />
            </Tooltip>
            <Tooltip title="Zoom Out">
              <Button
                size="small"
                icon={<ZoomOutOutlined />}
                onClick={zoomOut}
              />
            </Tooltip>
            <Tooltip title="Zoom In">
              <Button size="small" icon={<ZoomInOutlined />} onClick={zoomIn} />
            </Tooltip>

            <span className="text-[12px] text-gray-500">
              {Math.round(zoom * 100)}%
            </span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="p-[12px] border border-[#F1F1F1] overflow-auto h-[80vh]"
      >
        <div style={{ width: "max-content" }}>
          {pages.map((page, idx) => (
            <div key={idx} className="mb-6">
              <img
                src={`data:image/jpeg;base64,${page.image_data}`}
                alt={`Page ${idx + 1}`}
                style={{
                  transform: `
                    scale(${zoom})
                    rotate(${rotation}deg)
                  `,
                  transformOrigin: "top left",
                  transition: "transform 0.3s ease",
                  display: "block",
                }}
                className="rounded"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OriginalDocument;
