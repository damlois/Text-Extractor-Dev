import React from "react";
import { Confidence } from "../../types";

interface ConfidenceBadgeProps {
  confidence: Confidence;
}

const getAverageConfidence = (confidence: Confidence): number => {
  if (typeof confidence === "number") {
    return confidence;
  }

  // Handle object with numeric values
  if (!Array.isArray(confidence)) {
    const values = Object.values(confidence);
    const validNumbers = values.filter((v) => typeof v === "number");

    if (validNumbers.length === 0) return NaN;

    const sum = validNumbers.reduce((acc, val) => acc + val, 0);
    return sum / validNumbers.length;
  }

  // Handle array of objects
  const allValues: number[] = [];

  for (const obj of confidence) {
    if (typeof obj === "object" && obj !== null) {
      for (const val of Object.values(obj)) {
        if (typeof val === "number") {
          allValues.push(val);
        }
      }
    }
  }

  if (allValues.length === 0) return NaN;

  const total = allValues.reduce((acc, val) => acc + val, 0);
  return total / allValues.length;
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
