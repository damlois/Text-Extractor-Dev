import { Button } from "antd";
import { ReactNode } from "react";

interface AppButtonProps {
  bgColor?: string;
  hoverbgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  children?: ReactNode;
  width?: string;
}

const AppButton = ({
  bgColor = "bg-yellow",
  hoverbgColor = "!hover:bg-white",
  textColor = "text-[#1D1E18]",
  hoverTextColor = "!hover:text-[#1D1E18]",
  width,
  children,
}: AppButtonProps) => {
  return (
    <Button
      className={`font-montserratAlternates p-6 ${bgColor} ${hoverbgColor} ${textColor} ${hoverTextColor} 
      rounded-full text-lg font-medium border-none ring-0`}
      style={{ width: width || "100%" }}
    >
      {children}
    </Button>
  );
};

export default AppButton;
