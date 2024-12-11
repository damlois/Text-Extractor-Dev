import { Card } from "antd";
import {
  FolderOutlined,
  FolderOpenOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Project } from "../../../../types";
import { formatDate } from "../../../../utils/notification";

interface ProjectCardProps {
  project: Project;
  onClick: (project: Project) => void;
  isHovered: boolean;
  setIsHovered: (hovered: boolean) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  onClick,
  isHovered,
  setIsHovered,
}) => {
  return (
    <Card
      key={project.project_id}
      className="min-w-[240px] border-1 border-[#F0F0F0] rounded-none flex flex-col"
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: 0,
        height: "100%",
      }}
    >
      <div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="w-full cursor-pointer"
        onClick={() => onClick(project)}
      >
        <div className="w-full h-[121px] flex justify-center items-center bg-[#F0F0F0]">
          {isHovered ? (
            <FolderOpenOutlined className="text-deep-blue text-[48px]" />
          ) : (
            <FolderOutlined className="text-deep-blue text-[48px]" />
          )}
        </div>

        <div className="p-4 font-inter text-sm border-b border-1 w-full border-[#F0F0F0] flex-grow">
          <p className="text-dark-gray font-medium mb-2">{project.name}</p>
          <div className="flex gap-1 text-gray text-[14px]">
            <p>{formatDate(project.created_at)}</p>
            <p>•</p>
            <p>{project.files_data.length} files</p>
          </div>
        </div>
      </div>

      <div className="p-3 text-gray grid grid-cols-2 grid-flow-col w-full mt-auto">
        <EditOutlined className="text-[16px] flex justify-center items-center border-r border-[#f0f0f0]" />
        <DeleteOutlined className="text-[16px] flex justify-center items-center" />
      </div>
    </Card>
  );
};

export default ProjectCard;
