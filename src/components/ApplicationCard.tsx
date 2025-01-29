import { FileDoneOutlined } from "@ant-design/icons";

interface ApplicationCardProps {
  title: string;
  description: string;
  onClick: () => void;
}

const ApplicationCard: React.FC<ApplicationCardProps> = ({
  title,
  description,
  onClick,
}) => {
  return (
    <div
      className="flex items-center h-full gap-4 max-w-lg p-2 border border-[#f0f0f0] rounded-lg min-h-24 cursor-pointer"
      onClick={onClick}
    >
      <div
        className="h-full w-1/3 flex justify-center items-center rounded-md"
        style={{
          background: "linear-gradient(270deg, #F25325 -68.36%, #006A94 100%)",
        }}
      >
        <FileDoneOutlined style={{ fontSize: "24px", color: "#fff" }} />
      </div>

      <div className="w-2/3">
        <div className="font-medium text-sm text-dark-gray mb-2">{title}</div>
        <div className="text-sm text-gray font-normal">{description}</div>
      </div>
    </div>
  );
};

export default ApplicationCard;
