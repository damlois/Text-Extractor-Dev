import { Button, Spin } from "antd";

interface AppButtonProps {
  variant?: "primary" | "secondary";
  bgColor?: string;
  hoverbgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  children?: string | React.ReactNode;
  width?: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
  loading?: boolean;
}

const AppButton = ({
  variant = "primary",
  bgColor,
  hoverbgColor,
  textColor,
  hoverTextColor,
  width,
  disabled,
  children,
  className,
  loading = false,
  onClick,
}: AppButtonProps) => {
  const isPrimary = variant === "primary";
  const defaultBgColor = isPrimary ? "!bg-[#004763]" : "!bg-white";
  const defaultHoverBgColor = isPrimary
    ? "!hover:bg-white"
    : "!hover:bg-[#004763]";
  const defaultTextColor = isPrimary ? "!text-white" : "!text-[#004763]";
  const defaultHoverTextColor = isPrimary
    ? "!hover:text-[#004763]"
    : "!hover:text-white";
  const defaultBorderColor = isPrimary
    ? "!border-transparent"
    : "!border-[#004763]";
  const defaultHoverBorderColor = isPrimary
    ? "!hover:border-[#004763]"
    : "!border-transparent";

  return (
    <Button
      className={`font-inter px-[15px] py-[4px] ${className} ${
        !disabled ? bgColor || defaultBgColor : ""
      } 
        ${hoverbgColor || defaultHoverBgColor} ${textColor || defaultTextColor} 
        ${hoverTextColor || defaultHoverTextColor}
        ${disabled || loading ? "bg-gray-400 cursor-not-allowed" : ""}
        border ${defaultBorderColor} ${defaultHoverBorderColor}
        text-[14px] h-[30px] rounded-sm transition-all flex items-center mx-auto`}
      style={{ width: width || "100%" }}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading && (
        <Spin
          size="small"
          className="mr-2"
          style={{ color: isPrimary ? "white" : "#004763" }}
        />
      )}
      {children}
    </Button>
  );
};

export default AppButton;
