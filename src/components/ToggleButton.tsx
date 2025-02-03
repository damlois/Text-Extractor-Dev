import React, { useState } from "react";
import { ExtractionStatus } from "../types";

interface ToggleButtonProps {
  options: ExtractionStatus[];
  onSelect: (selected: ExtractionStatus | null) => void;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ options, onSelect }) => {
  const [selected, setSelected] = useState<ExtractionStatus | null>(null);

  const handleClick = (option: ExtractionStatus) => {
    const newSelection = selected === option ? null : option;
    setSelected(newSelection);
    onSelect(newSelection);
  };

  return (
    <div className="flex gap-2">
      {options.map((option) => (
        <button
          key={option}
          className={`px-4 py-2 rounded-[17px] border text-[12px] ${
            selected === option
              ? "text-deep-blue border-deep-blue"
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
