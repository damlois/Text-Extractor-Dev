import { Button } from "antd";

interface AppButtonProps {
  bgColor?: string;
  hoverbgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  children?: string;
  width?: string;
  disabled?: boolean;
  className?: string;
  onClick: () => void;
}

const AppButton = ({
  bgColor = "bg-[#004763]",
  hoverbgColor = "!hover:bg-white",
  textColor = "text-white",
  hoverTextColor = "!hover:text-[#004763]",
  width,
  disabled,
  children,
  className,
  onClick,
}: AppButtonProps) => {
  return (
    <Button
      className={`font-inter px-[15px] py-[4px] ${className} ${bgColor} ${hoverbgColor} ${textColor} ${hoverTextColor} 
        ${disabled ? "bg-gray-400" : "bg-[#004763]"} 
        hover:border-[#004763] border border-transparent 
        text-[14px] h-[30px] rounded-sm transition-all`}
      style={{ width: width || "100%" }}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

export default AppButton;
