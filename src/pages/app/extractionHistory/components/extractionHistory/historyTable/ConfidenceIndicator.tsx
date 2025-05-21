import React from "react";
import { ProcessedDocument } from "../../../../../../types";
import { Tooltip } from "antd";
import { DuplicateDocumentItemResponse } from "../../../types";

interface ConfidenceIndicatorProps {
  record: ProcessedDocument | DuplicateDocumentItemResponse | null;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  record,
}) => {
  const { processing_status, extracted_content } = record || {};
  const confidence = extracted_content?.overall_confidence;

  if (
    processing_status?.toLowerCase() === "processing" ||
    processing_status?.toLowerCase() === "failed" ||
    !confidence?.score
  ) {
    return (
      <span className="font-medium text-[14px] text-[#000000D9]">N/A</span>
    );
  }

  const confidencePercent = confidence?.score * 100;

  let color = "!text-[#166534]";
  if (confidencePercent < 70) color = "!text-[#CF1322]";
  else if (confidencePercent < 85) color = "!text-[#FAAD14]";

  return (
    <Tooltip title={confidence?.reason}>
      <span className={`font-medium text-[14px] ${color}`}>
        {confidencePercent}%
      </span>
    </Tooltip>
  );
};

export default ConfidenceIndicator;
