import { Button } from "antd";

interface AppButtonProps {
  bgColor?: string;
  hoverbgColor?: string;
  textColor?: string;
  hoverTextColor?: string;
  text?: string;
  width: string;
}

const AppButton = ({
  bgColor = "bg-yellow",
  hoverbgColor = "!hover:bg-white",
  textColor = "text-gray-800",
  hoverTextColor = "!hover:text-gray-800",
  width,
  text,
}: AppButtonProps) => {
  return (
    <Button
      className={`font-montserratAlternates py-6 ${bgColor} ${hoverbgColor} ${textColor} ${hoverTextColor} 
      rounded-full text-lg font-medium border-none ring-0`}
      style={{ width: width || "100%" }}
    >
      {text}
    </Button>
  );
};

export default AppButton;
