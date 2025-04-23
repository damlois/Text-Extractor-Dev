import React from "react";
import {
  ClockCircleOutlined,
  EyeOutlined,
  CheckCircleOutlined,
  WarningOutlined,
} from "@ant-design/icons";
import { Tooltip } from "antd";
import { ReviewStatus } from "../../types";
import { ProcessedInvoice } from "../../../../../../../types";

interface ReviewStatusBadgeProps {
  record: ProcessedInvoice;
}

const statusMap: Record<
  ReviewStatus,
  {
    label: string;
    info: string;
    icon: JSX.Element;
    bgColor: string;
    textColor: string;
  }
> = {
  pending: {
    label: "Pending",
    info: "Document waiting to be reviewed",
    icon: <ClockCircleOutlined />,
    bgColor: "bg-[#FEF9C3]",
    textColor: "text-[#854D0E]",
  },
  in_review: {
    label: "In Review",
    info: "Document in review by Ann Winston",
    icon: <EyeOutlined />,
    bgColor: "bg-[#FAF5FF]",
    textColor: "text-[#9333EA]",
  },
  qa_passed: {
    label: "QA Passed",
    info: "QA passed by Lisa Wang",
    icon: <CheckCircleOutlined />,
    bgColor: "bg-[#DCFCE7]",
    textColor: "text-[#166534]",
  },
  not_applicable: {
    label: "N/A",
    info: "Unable to review. Invoice failed to extract or is still processing",
    icon: <WarningOutlined />,
    bgColor: "bg-[#F0F0F0]",
    textColor: "text-[#00000073]",
  },
};

const ReviewStatusBadge: React.FC<ReviewStatusBadgeProps> = ({ record }) => {
  let status = record.review_status;

  if (record.processing_status.toLowerCase() !== "successful") {
    status = "not_applicable";
  }

  const { label, info, icon, bgColor, textColor } = statusMap[status];

  return (
    <Tooltip title={info}>
      <span
        className={`inline-flex items-center px-2 py-0.5 text-[12px]] rounded-full ${bgColor} ${textColor}`}
      >
        <span className="mr-1">{icon}</span>
        {label}
      </span>
    </Tooltip>
  );
};

export default ReviewStatusBadge;
