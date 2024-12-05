import { AppstoreOutlined, DownOutlined, UnorderedListOutlined } from "@ant-design/icons";
import { Dropdown, Menu, Button, Space } from "antd";

interface ProjectViewToggleProps {
  activeView: "List" | "Grid";
  setActiveView: (view: "List" | "Grid") => void;
}

const ProjectViewToggle: React.FC<ProjectViewToggleProps> = ({
  activeView,
  setActiveView,
}) => {
  return (
    <div className="flex gap-[9px] flex-wrap">
      <div>
        <AppstoreOutlined
          className={`py-2 px-[14px] border rounded-l-[3px] border-${
            activeView === "Grid" ? "deep-blue" : "[#D9D9D9]"
          } cursor-pointer text-[14px] border-r-0 text-${
            activeView === "Grid" ? "white" : "dark-gray"
          } bg-${activeView === "Grid" ? "deep-blue" : "white"}`}
          onClick={() => setActiveView("Grid")}
        />
        <UnorderedListOutlined
          className={`py-2 px-[14px] border border-l-0 text-[14px] border-1 rounded-r-[3px] border-${
            activeView === "List" ? "deep-blue" : "[#D9D9D9]"
          } cursor-pointer text-${
            activeView === "List" ? "white" : "dark-gray"
          } bg-${activeView === "List" ? "deep-blue" : "white"}`}
          onClick={() => setActiveView("Grid")}
        />
      </div>
      <Dropdown
        overlay={
          <Menu>
            <Menu.Item key="1">Most Recent</Menu.Item>
          </Menu>
        }
        trigger={["click"]}
        className="font-inter py-2 rounded-[2px] text-dark-gray text-[14px] border-[#D9D9D9]"
      >
        <Button>
          <Space>
            <DownOutlined /> Most Recent
          </Space>
        </Button>
      </Dropdown>
    </div>
  );
};

export default ProjectViewToggle;
