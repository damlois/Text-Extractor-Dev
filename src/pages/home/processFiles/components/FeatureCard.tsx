import React from "react";
import { Card, Image } from "antd";
import { CheckOutlined } from "@ant-design/icons";

interface FeatureCardProps {
  title: string;
  features: string[];
  iconSrc: string;
  onClick: () => void;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  title,
  features,
  iconSrc,
  onClick,
}) => {
  return (
    <Card
      className="w-full max-w-[260px] border border-[#F0F0F0] rounded-sm font-inter cursor-pointer hover:border-deep-blue"
      title={
        <div className="font-medium text-black text-opacity-85">{title}</div>
      }
      extra={
        <div className="flex items-center justify-center p-2">
          <Image className="mt-1" src={iconSrc} alt={`${title} icon`} />
        </div>
      }
      bodyStyle={{ flexGrow: 1 }}
      onClick={onClick}
    >
      <ul className="space-y-3 text-gray font-[14px] font-inter">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-3">
            <CheckOutlined className="mt-1" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>
    </Card>
  );
};

export default FeatureCard;
