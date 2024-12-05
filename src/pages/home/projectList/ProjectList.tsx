import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "../../../components/PageHeader";
import { Project } from "../../../types";
import { useGetProjects } from "../../../hooks/useFileProcessor";
import { useFileProcessor } from "../../../context/FileProcessorContext";
import { Image, Spin } from "antd";
import NoProjects from "./components/NoProjects";
import PaginationControls from "./components/PaginationControls";
import ProjectCard from "./components/ProjectCard";
import ProjectViewToggle from "./components/ProjectViewToggle";

const ProjectList = () => {
  const [activeView, setActiveView] = useState<"List" | "Grid">("Grid");
  const [results, setResults] = useState<Project[] | undefined>([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pageSize, setPageSize] = useState<number>(8);
  const [hoveredProjectId, setHoveredProjectId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { getProjects } = useGetProjects();
  const { setSessionType, setCurrentProject } = useFileProcessor();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await getProjects();
      setLoading(false);
      setResults(data);
    };

    fetchData();
  }, []);

  const paginatedResults = results?.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  const handleProjectClick = (project: Project) => {
    setSessionType("Existing");
    setCurrentProject(project);
    navigate("/home/process-files");
  };

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
        {loading ? (
          <Spin className="mt-20" size="large" />
        ) : (
          <>
            {results?.length ? (
              <>
                <div className="mt-5 mb-5 flex gap-4 flex-wrap w-full justify-between text-[16px] font-medium">
                  <h5>My Projects</h5>
                  <ProjectViewToggle
                    activeView={activeView}
                    setActiveView={setActiveView}
                  />
                </div>

                <div
                  className={`grid ${
                    activeView === "Grid"
                      ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
                      : "grid-cols-1 gap-2"
                  } w-full`}
                >
                  {paginatedResults?.map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      onClick={handleProjectClick}
                      isHovered={hoveredProjectId === project.id}
                      setIsHovered={(hovered: boolean) =>
                        setHoveredProjectId(hovered ? project.id : null)
                      }
                    />
                  ))}
                </div>

                <PaginationControls
                  currentPage={currentPage}
                  pageSize={pageSize}
                  total={results.length}
                  onPageChange={(page, size) => {
                    setCurrentPage(page);
                    setPageSize(size);
                  }}
                />
              </>
            ) : (
              <NoProjects />
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectList;
