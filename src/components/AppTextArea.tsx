import React from "react";
import { Tooltip } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import TextArea from "antd/es/input/TextArea";

interface AppTextAreaProps {
  label: string;
  tooltip?: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  className?: string;
  required?: boolean;
  maxWords?: number;
}

const AppTextArea: React.FC<AppTextAreaProps> = ({
  label,
  tooltip,
  placeholder,
  value = "",
  onChange,
  className,
  required = false,
  maxWords = 100,
}) => {
  const wordCount = value.trim().split(/\s+/).filter(Boolean).length;

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const inputValue = e.target.value;
    const inputWordCount = inputValue
      .trim()
      .split(/\s+/)
      .filter(Boolean).length;

    if (inputWordCount <= maxWords || inputValue === "") {
      onChange(e);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-2 mt-6">
        <label className="text-gray-700 align-middle flex items-center">
          {required && <span className="text-red-500 mr-1">*</span>}
          {label}
        </label>

        {tooltip && (
          <Tooltip title={tooltip}>
            <InfoCircleOutlined className="text-gray-500" />
          </Tooltip>
        )}
      </div>

      <TextArea
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`px-[12px] py-[8px] rounded-sm border border-[#D9D9D9] resize-none ${className}`}
        rows={5}
      />

      <div className="flex float-end text-sm text-[#D9D9D9] font-inter mt-1">
        {wordCount}/{maxWords}
      </div>
    </div>
  );
};

export default AppTextArea;
