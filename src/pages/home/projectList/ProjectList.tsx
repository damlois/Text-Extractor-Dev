import PageHeader from "../../../components/PageHeader";
import AppButton from "../../../components/AppButton";
import { useNavigate } from "react-router-dom";
import { Card, Dropdown, Menu, Button, Space, Image, Pagination } from "antd";
import {
  UnorderedListOutlined,
  AppstoreOutlined,
  DownOutlined,
  FolderOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useEffect, useState } from "react";
import { Project } from "../../../types";
import { useGetProjects } from "../../../hooks/useFileProcessor";
import { formatDate } from "../../../utils/notification";

const ProjectList = () => {
  const [activeView, setActtiveView] = useState<"List" | "Grid">("Grid");
  const [results, setResults] = useState<Project[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const navigate = useNavigate();

  const { getProjects } = useGetProjects();

  useEffect(() => {
    const fetchData = async () => {
      const data = await getProjects();
      setResults(data);
    };

    fetchData();
  }, []);

  const paginatedResults = results.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex flex-col items-start font-inter">
      <PageHeader
        currentPage="Home"
        action="+ New Project"
        onActionClick={() => navigate("/home/create-project")}
      />

      <div className="flex flex-col items-center w-full p-6">
        <Image
          src="/assets/icons/hero-bg.png"
          preview={false}
          alt="hero image"
          width={"100%"}
        />
        {results.length ? (
          <>
            <div className="mt-5 mb-5 flex gap-4 flex-wrap w-full justify-between text-[16px] font-medium">
              <h5>My Projects</h5>
              <div className="flex gap-[9px] flex-wrap">
                <div>
                  <AppstoreOutlined
                    className={`py-2 px-[14px] border rounded-l-[3px] border-${
                      activeView === "Grid" ? "deep-blue" : "[#D9D9D9]"
                    } cursor-pointer text-[14px] border-r-0 text-${
                      activeView === "Grid" ? "white" : "dark-gray"
                    } bg-${activeView === "Grid" ? "deep-blue" : "white"}`}
                    onClick={() => setActtiveView("Grid")}
                  />
                  <UnorderedListOutlined
                    className={`py-2 px-[14px] border border-l-0 text-[14px] border-1 rounded-r-[3px] border-${
                      activeView === "List" ? "deep-blue" : "[#D9D9D9]"
                    } cursor-pointer text-${
                      activeView === "List" ? "white" : "dark-gray"
                    } bg-${activeView === "List" ? "deep-blue" : "white"}`}
                    onClick={() => setActtiveView("Grid")}
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
            </div>

            <div
              className={`grid ${
                activeView === "Grid"
                  ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                  : "grid-cols-1 gap-2"
              } w-full`}
            >
              {paginatedResults.map((project, index) => (
                <Card
                  key={index}
                  className="min-w-[240px] border-1 border-[#F0F0F0] rounded-none flex flex-col"
                  bodyStyle={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    padding: 0,
                    height: "100%",
                  }}
                >
                  <div className="w-full h-[121px] flex justify-center items-center bg-[#F0F0F0]">
                    <FolderOutlined className="text-deep-blue text-[48px]" />
                  </div>

                  <div className="p-4 font-inter text-sm border-b border-1 w-full border-[#F0F0F0] flex-grow">
                    <p className="text-dark-gray font-medium mb-2">
                      {project.name}
                    </p>
                    <div className="flex gap-1 text-gray text-[14px]">
                      <p>{formatDate(project.created_at)}</p>
                      <p>•</p>
                      <p>10 files</p>
                    </div>
                  </div>

                  <div className="p-3 text-gray grid grid-cols-2 grid-flow-col w-full mt-auto">
                    <EditOutlined className="text-[16px] flex justify-center items-center border-r border-[#f0f0f0]" />
                    <DeleteOutlined className="text-[16px] flex justify-center items-center" />
                  </div>
                </Card>
              ))}

              <div className="flex mt-6">
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={results.length}
                  onChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                  showSizeChanger
                  pageSizeOptions={["8", "12", "16", "20"]}
                />
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="flex flex-col items-center mt-6">
              <Image
                src="/assets/icons/upload.png"
                preview={false}
                alt="create new project"
                width="238px"
                height="235px"
              />
              <div className="font-inter text-[14px] m-4">
                Click the button below to begin a new project
              </div>
              <AppButton
                onClick={() => navigate("/home/create-project")}
                width="133px"
                className="mb-8"
              >
                + New Project
              </AppButton>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
