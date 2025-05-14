import {
  InfoCircleOutlined,
  ZoomInOutlined,
  ZoomOutOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { Tooltip, Button } from "antd";
import { useState, useRef, useEffect } from "react";

const OriginalDocument = ({ pages }: { pages: { image_data: string }[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const [dimensions, setDimensions] = useState<
    { width: number; height: number }[]
  >(Array(pages.length).fill({ width: 0, height: 0 }));

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const childHeight = containerRef.current.scrollHeight / pages.length;
      const page = Math.ceil((scrollTop + 1) / childHeight);
      setCurrentPage(page);
    }
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.1, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.1, 0.1));
  const rotateClockwise = () => setRotation((prev) => (prev + 90) % 360);

  const handleImageLoad = (index: number, img: HTMLImageElement) => {
    const { width, height } = img;
    setDimensions((prev) => {
      const updated = [...prev];
      updated[index] = { width, height };
      return updated;
    });
  };

  const getTransformedSize = (
    width: number,
    height: number,
    rotation: number,
    zoom: number
  ) => {
    const angle = rotation % 360;
    if (angle === 90 || angle === 270) {
      return { width: height * zoom, height: width * zoom };
    }
    return { width: width * zoom, height: height * zoom };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="px-[18px] py-[12px] text-[16px] font-bold text-dark-gray bg-[#F9FAFB] rounded-t-[8px] flex justify-between flex-wrap items-center">
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
              <Button size="small" icon={<ZoomOutOutlined />} onClick={zoomOut} />
            </Tooltip>
            <Tooltip title="Zoom In">
              <Button size="small" icon={<ZoomInOutlined />} onClick={zoomIn} />
            </Tooltip>
            
            <span className="text-[12px] text-gray-500">{Math.round(zoom * 100)}%</span>
          </div>
        </div>
      </div>

      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="py-[18px] px-[12px] border border-[#F1F1F1] overflow-auto h-[80vh]"
      >
        {pages.map((page, idx) => {
          const { width, height } = dimensions[idx] || { width: 0, height: 0 };
          const angle = rotation % 360;

          const { width: transformedWidth, height: transformedHeight } =
            getTransformedSize(width, height, rotation, zoom);

          // Translation fixes for rotation
          let translateX = 0;
          let translateY = 0;
          if (angle === 90) {
            translateX = height * zoom;
          } else if (angle === 180) {
            translateX = width * zoom;
            translateY = height * zoom;
          } else if (angle === 270) {
            translateY = width * zoom;
          }

          return (
            <div
              key={idx}
              className="mb-6 flex justify-center"
              style={{
                minHeight: transformedHeight + 20, // prevent overlap
              }}
            >
              <div
                style={{
                  width: transformedWidth,
                  height: transformedHeight,
                  overflow: "visible",
                }}
              >
                <img
                  src={`data:image/jpeg;base64,${page.image_data}`}
                  alt={`Invoice Page ${idx + 1}`}
                  onLoad={(e) => handleImageLoad(idx, e.currentTarget)}
                  style={{
                    transform: `
                      translate(${translateX}px, ${translateY}px)
                      scale(${zoom})
                      rotate(${rotation}deg)
                    `,
                    transformOrigin: "top left",
                    transition: "transform 0.3s ease",
                    display: "block",
                    maxWidth: "unset",
                  }}
                  className="rounded border-t border-[#E5E7EB80]"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OriginalDocument;
