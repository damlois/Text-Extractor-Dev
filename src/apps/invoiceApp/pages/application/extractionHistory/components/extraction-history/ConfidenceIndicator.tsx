import React from "react";

interface ConfidenceIndicatorProps {
  value: string | null;
}

const ConfidenceIndicator: React.FC<ConfidenceIndicatorProps> = ({ value }) => {
  const confidencePercent = Number(value) * 100;

  if (value === null || value === undefined) {
    return (
      <span className="font-medium text-[14px] text-[#000000D9]">N/A</span>
    );
  }

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
