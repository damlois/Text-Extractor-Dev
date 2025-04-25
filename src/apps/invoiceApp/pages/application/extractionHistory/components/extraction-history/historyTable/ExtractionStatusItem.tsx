import { ClockCircleOutlined, WarningOutlined } from "@ant-design/icons";
import { Tooltip } from "antd";
import { StatusType } from "../../../types";

const statusMap: Record<
  StatusType,
  { dotColor: string; icon: JSX.Element; label: string }
> = {
  successful: {
    dotColor: "#006A94",
    icon: <img src="/assets/icons/custom-check-circle.svg" />,
    label: "Extraction Successful",
  },
  processing: {
    dotColor: "#FAAD14",
    icon: <ClockCircleOutlined className="text-[#FAAD14]" />,
    label: "Processing",
  },
  failed: {
    dotColor: "#F5222D",
    icon: <WarningOutlined className="text-[#F5222D]" />,
    label: "Extraction Failed",
  },
};

const ExtractionStatusItem = ({ type }: { type: StatusType }) => {
  const { dotColor, icon, label } = statusMap[type] ?? statusMap["successful"];

  return (
    <div className="flex items-center py-2">
      <span
        className="w-2 h-2 rounded-full mr-2"
        style={{ backgroundColor: dotColor }}
      />
      <Tooltip title={label}>{icon}</Tooltip>
    </div>
  );
};

export default ExtractionStatusItem;
