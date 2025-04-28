import React from "react";
import { ProcessedInvoice } from "../../../../../../../../types";

interface ConfidenceIndicatorProps {
  record: ProcessedInvoice | null;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({
  record,
}) => {
  const { processing_status, confidence_level } = record || {};

  if (
    processing_status?.toLowerCase() === "processing" ||
    processing_status?.toLowerCase() === "failed"
  ) {
    return (
      <span className="font-medium text-[14px] text-[#000000D9]">N/A</span>
    );
  }

  const confidencePercent = Number(confidence_level) * 100;

  let color = "text-[#166534]";
  if (confidencePercent < 70) color = "text-[#CF1322]";
  else if (confidencePercent < 85) color = "text-[#FAAD14]";

  return (
    <span className={`font-medium text-[14px] ${color}`}>
      {confidencePercent}%
    </span>
  );
};

export default ConfidenceIndicator;
