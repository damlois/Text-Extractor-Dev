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
}

const AppTextArea: React.FC<AppTextAreaProps> = ({
  label,
  tooltip,
  placeholder,
  value,
  onChange,
  className,
  required = false,
}) => {
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
        onChange={onChange}
        className={`px-[12px] py-[8px] h-[40px] rounded-sm border-1 border-[#D9D9D9] ${className}`}
        rows={5}
      />
    </div>
  );
};

export default AppTextArea;
