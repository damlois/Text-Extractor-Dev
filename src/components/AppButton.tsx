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

  const defaultStyles = `
    font-inter px-[15px] py-[4px] text-[14px] h-[30px] rounded-sm transition-all flex items-center mx-auto
  `;

  const hoverStyles = `
    ${hoverbgColor || (isPrimary ? "hover:bg-white" : "hover:bg-[#004763]")}
    ${hoverTextColor || (isPrimary ? "hover:text-[#004763]" : "hover:text-white")}
  `;

  const defaultBg = bgColor || (isPrimary ? "bg-[#004763]" : "bg-white");
  const defaultText = textColor || (isPrimary ? "text-white" : "text-[#004763]");

  const disabledStyles = `
    bg-gray-100 
    !border-[1px] !border-[#D9D9D9] 
    !text-[rgba(0,0,0,0.25)] 
    cursor-not-allowed
  `;

  return (
    <Button
      className={`${defaultStyles} ${defaultBg} ${defaultText} ${
        !disabled ? hoverStyles : disabledStyles
      } ${className}`}
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
