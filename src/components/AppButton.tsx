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
  hoverbgColor = "hover:bg-white",
  textColor = "text-[#1D1E18]",
  hoverTextColor = "hover:text-[#1D1E18]",
  width,
  children,
}: AppButtonProps) => {
  return (
    <button
      className={`font-montserratAlternates px-6 py-4 ${bgColor} duration-300 ease-in-out 
      ${hoverbgColor} hover:scale-105 ${textColor} ${hoverTextColor} 
      rounded-full text-lg font-medium border-none ring-0`}
      style={{ width: width || "100%" }}
    >
      {children}
    </button>
  );
};

export default AppButton;
