import React from "react";
import { ExtractionStatus } from "../types";

interface ToggleButtonProps {
  options: string[];
  value?: string | string[];
  multiple?: boolean;
  onSelect: (selected: string | string[] | null) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  options,
  value,
  multiple = false,
  onSelect
}) => {
  const handleClick = (option: string) => {
    if (multiple) {
      const currentValue = (value as string[]) || [];
      const newValue = currentValue.includes(option)
        ? currentValue.filter(v => v !== option)
        : [...currentValue, option];
      onSelect(newValue.length ? newValue : null);
    } else {
      onSelect(value === option ? null : option);
    }
  };

  const isSelected = (option: string) => {
    if (multiple) {
      return (value as string[])?.includes(option);
    }
    return value === option;
  };

  return (
    <div className="flex gap-2 flex-wrap">
      {options.map((option) => (
        <button
          key={option}
          className={`px-4 py-2 rounded-[17px] border text-[12px] ${isSelected(option)
              ? "text-deep-blue border-deep-blue bg-[#E6F7FF]"
              : "text-dark-gray border-[#D9D9D9D9]"
            } cursor-pointer`}
          onClick={() => handleClick(option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
};

export default ToggleButton;
