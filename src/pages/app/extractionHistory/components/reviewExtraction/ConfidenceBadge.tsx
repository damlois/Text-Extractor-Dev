import React from "react";
import { Confidence } from "../../types";

interface ConfidenceBadgeProps {
  confidence: Confidence;
}

const getAverageConfidence = (confidence: any): number => {
  // Case 1: Single number
  if (typeof confidence === "number") {
    return confidence;
  }

  // Case 2: Array of objects with 'confidence' field
  if (Array.isArray(confidence)) {
    const confidenceValues = confidence
      .map((item) => item?.confidence)
      .filter((val): val is number => typeof val === "number");

    if (confidenceValues.length === 0) return NaN;

    const sum = confidenceValues.reduce((acc, val) => acc + val, 0);
    return sum / confidenceValues.length;
  }

  // Case 3: Object with numeric values
  if (typeof confidence === "object" && confidence !== null) {
    const values = Object.values(confidence);
    const validNumbers = values.filter((v): v is number => typeof v === "number");

    if (validNumbers.length === 0) return NaN;

    const sum = validNumbers.reduce((acc, val) => acc + val, 0);
    return sum / validNumbers.length;
  }

  // If nothing matches, return NaN
  return NaN;
};

const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ confidence }) => {
  let textColorClass = "!text-[#166534]";
  let bgColorClass = "bg-[#DCFCE7]";

  const confidencePercent = getAverageConfidence(confidence) * 100;

  if (isNaN(confidencePercent)) {
    return null;
  }

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
