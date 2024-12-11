import { useState, useEffect } from "react";
import { fileProcessorApi } from "../api/api";
import { useFileProcessor } from "../context/FileProcessorContext";
import { Instruction } from "../types";

export const useCurrentUser = () => {
  const { setCurrentUser } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getCurrentUser().then((res) => {
      setCurrentUser(res.data);
      setLoading(false);
    });
  }, [setCurrentUser]);

  return { loading };
};

export const useProjects = () => {
  const { setProjects } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getProjects().then((res) => {
      setProjects(res.data.data);
      setLoading(false);
    });
  }, [setProjects]);

  return { loading };
};

export const useCreateProject = () => {
  const { setProjects, setCurrentProject, setSessionType } = useFileProcessor();

  const createProject = async (data: {
    name: string;
    description?: string;
  }) => {
    const response = await fileProcessorApi.createProject(data);
    console.log(response);
    setCurrentProject(response.data.data);
    setSessionType("New");
    setProjects((prevProjects) => [...prevProjects, response.data.data]);
    return response.data.data;
  };

  return { createProject };
};

export const useGetProjects = () => {
  const { setProjects } = useFileProcessor();

  const getProjects = async () => {
    try {
      const projectResponse = await fileProcessorApi.getProjects();


      if (!projectResponse || !projectResponse.data) {
        throw new Error("No project data found");
      }

      const response = await Promise.all(
        projectResponse.data.data.map(async (project) => {
          const files = await fileProcessorApi.getFiles(project.project_id);
          return {
            ...project,
            files_data: files.data.data.map((file) => file),
          };
        })
      );

      setProjects(
        response.sort(
          (a, b) =>
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
      );

      return response;
    } catch (error) {
      console.error("Error fetching projects or files:", error);
    }
  };

  return { getProjects };
};

export const useUploadFiles = () => {
  const { currentProject, setCurrentProject, setProjects } = useFileProcessor();
  console.log(currentProject);

  const uploadFiles = async (files: File[]) => {
    if (!currentProject) throw new Error("No project selected");

    const fileList = new DataTransfer();
    files.forEach((file) => fileList.items.add(file));

    const response = await fileProcessorApi.uploadFiles(
      currentProject.project_id,
      fileList.files
    );

    setCurrentProject({ ...currentProject, files_data: response.data.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.project_id === currentProject.project_id
          ? { ...project, files_data: response.data.data }
          : project
      )
    );
    return response.data.data;
  };

  return { uploadFiles };
};

export const useAnalyzeFiles = () => {
  const { currentProject, setCurrentProject, setProjects } = useFileProcessor();

  const analyzeFiles = async (instructions: Instruction[]) => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.analyzeFiles(
      currentProject.project_id,
      instructions
    );

    setCurrentProject({ ...currentProject, analysis_data: response.data.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.project_id === currentProject.project_id
          ? { ...project, analysis_data: response.data.data }
          : project
      )
    );

    return response.data.data;
  };

  return { analyzeFiles };
};

export const useGetProjectAnalyses = () => {
  const { currentProject, setCurrentProject, setProjects } = useFileProcessor();

  const getProjectAnalyses = async () => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.getProjectAnalyses(
      currentProject.project_id
    );

    setCurrentProject({ ...currentProject, analysis_data: response.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.project_id === currentProject.project_id
          ? { ...project, analysis_data: response.data }
          : project
      )
    );

    return response.data;
  };

  return { getProjectAnalyses };
};

export const useGetProjectImages = () => {
  const { currentProject, setCurrentProject, setProjects } = useFileProcessor();

  const getProjectImages = async () => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.getProjectImages(
      currentProject.project_id
    );

    setCurrentProject({ ...currentProject, image_data: response.data.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.project_id === currentProject.project_id
          ? { ...project, image_data: response.data.data }
          : project
      )
    );

    return response.data.data;
  };

  return { getProjectImages };
};

export const useSendMessage = () => {
  const { currentProject } = useFileProcessor();

  const sendMessage = async (data: {
    prompt: string;
    chat_type: "document" | "image";
    image_data?: string;
  }) => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.sendMessage(
      currentProject.project_id,
      data
    );
    return response.data;
  };

  return { sendMessage };
};

export const useChatHistory = (chatType: "document" | "image" | undefined) => {
  const { currentProject, setChatHistory } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentProject) return;

      const response = await fileProcessorApi.getChatHistory(
        currentProject.project_id,
        chatType
      );
      
      setChatHistory(response.data.data);
      setLoading(false);
    };

    fetchChatHistory();
  }, [chatType, currentProject, setChatHistory]);

  return { loading };
};
