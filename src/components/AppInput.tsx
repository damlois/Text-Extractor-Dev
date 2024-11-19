import React, { useState } from "react";
import { Tooltip, Input, Image } from "antd";
import { InfoCircleOutlined, PaperClipOutlined } from "@ant-design/icons";

interface AppInputProps {
  label?: string;
  tooltip?: string;
  placeholder?: string;
  value?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  rightIcon?: React.ReactNode;
  onPressEnter?: (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
  ) => void;
  fileUpload?: boolean;
  onFileChange?: (file: File | null) => void;
  style?: React.CSSProperties;
  loading?: boolean;
}

const AppInput: React.FC<AppInputProps> = ({
  label,
  tooltip,
  placeholder,
  value,
  onChange,
  className,
  required = false,
  rightIcon,
  onPressEnter,
  fileUpload = false,
  onFileChange,
  style,
  loading = false,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);

      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setFilePreview(reader.result as string);
        };
        reader.readAsDataURL(selectedFile);
      }

      onFileChange?.(selectedFile);
    }
  };

  const handleRemoveFile = () => {
    setFile(null);
    setFilePreview(null);
  };

  const handleSend = (
    e:
      | React.MouseEvent<HTMLSpanElement, MouseEvent>
      | React.KeyboardEvent<HTMLInputElement>
  ) => {
    onPressEnter && onPressEnter(e);
    handleRemoveFile();
  };

  return (
    <div>
      <div className={`${className} flex items-center gap-2 mb-2 `}>
        {label && (
          <label className="text-gray-700 align-middle flex items-center">
            {required && <span className="text-red-500 mr-1">*</span>}
            {label}
          </label>
        )}

        {tooltip && (
          <Tooltip title={tooltip}>
            <InfoCircleOutlined className="text-gray-500" />
          </Tooltip>
        )}
      </div>

      <div className="relative">
        <Input
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`py-[8px] h-[40px] rounded-sm border-1 border-[#D9D9D9] ${className}`}
          style={style}
          prefix={
            fileUpload && (
              <>
                <PaperClipOutlined
                  className="cursor-pointer"
                  style={{ fontSize: 16 }}
                />
                <input
                  type="file"
                  className="absolute top-0 right-0 opacity-0 cursor-pointer w-full"
                  onChange={handleFileChange}
                />
              </>
            )
          }
          addonAfter={
            rightIcon &&
            (!loading ? (
              <span
                onClick={(e) => handleSend(e)}
                style={{ cursor: "pointer" }}
              >
                {rightIcon}
              </span>
            ) : (
              <span style={{ cursor: "not-allowed", opacity: 0.5 }}>
                {rightIcon}
              </span>
            ))
          }
          onPressEnter={(e) => handleSend(e)}
        />

        {file && (
          <div className="mt-2 flex items-center gap-2">
            {filePreview ? (
              <Image
                width={50}
                height={50}
                src={filePreview}
                preview={false}
                alt="File preview"
                className="rounded-md"
              />
            ) : (
              <span className="text-gray-500">{file.name}</span>
            )}
            <button className="text-red-500" onClick={handleRemoveFile}>
              Remove
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AppInput;
