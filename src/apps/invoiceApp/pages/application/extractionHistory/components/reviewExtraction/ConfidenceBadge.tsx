import React from 'react';

interface ConfidenceBadgeProps {
  confidence: number;
}

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  let textColorClass = "!text-[#166534]";
  let bgColorClass = "bg-[#DCFCE7]";

  const confidencePercent = confidence * 100;

  if (confidencePercent < 70) {
    textColorClass = "!text-[#CF1322]";
    bgColorClass = "bg-[#F4D0D0]";
  } else if (confidencePercent < 85) {
    textColorClass = "!text-[#FAAD14]";
    bgColorClass = "bg-[#FFF2CC]";
  }

  return (
    <span
      className={`text-[10px] ${textColorClass} ${bgColorClass} px-[8px] pt-[2px] pb-[2px] ml-[6px] rounded-full`}
    >
      {confidencePercent.toFixed(0)}%
    </span>
  );
};

export default ConfidenceBadge;
