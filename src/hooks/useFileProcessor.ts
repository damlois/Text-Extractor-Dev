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
      setProjects(res.data);
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
    setCurrentProject(response.data);
    setSessionType("New");
    setProjects((prevProjects) => [...prevProjects, response.data]);
    return response.data;
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
        projectResponse.data.map(async (project) => {
          const files = await fileProcessorApi.getFiles(project.id);
          return {
            ...project,
            files_data: { files: files.data.map((file) => file) },
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

  const uploadFiles = async (files: File[]) => {
    if (!currentProject) throw new Error("No project selected");

    const fileList = new DataTransfer();
    files.forEach((file) => fileList.items.add(file));

    const response = await fileProcessorApi.uploadFiles(
      currentProject.id,
      fileList.files
    );

    setCurrentProject({ ...currentProject, files_data: response.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject.id
          ? { ...project, files_data: response.data }
          : project
      )
    );
    return response.data;
  };

  return { uploadFiles };
};

export const useAnalyzeFiles = () => {
  const { currentProject, setCurrentProject, setProjects } = useFileProcessor();

  const analyzeFiles = async (instructions: Instruction[]) => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.analyzeFiles(
      currentProject.id,
      instructions
    );

    setCurrentProject({ ...currentProject, analysis_data: response.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject.id
          ? { ...project, analysis_data: response.data }
          : project
      )
    );

    return response.data;
  };

  return { analyzeFiles };
};

export const useGetProjectAnalyses = () => {
  const { currentProject, setCurrentProject, setProjects } = useFileProcessor();

  const getProjectAnalyses = async () => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.getProjectAnalyses(
      currentProject.id
    );

    setCurrentProject({ ...currentProject, analysis_data: response.data });

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject.id
          ? { ...project, analysis_data: response.data }
          : project
      )
    );

    return response.data;
  };

  return { getProjectAnalyses };
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
      currentProject.id,
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
        currentProject.id,
        chatType
      );
      setChatHistory(response.data.history);
      setLoading(false);
    };

    fetchChatHistory();
  }, [chatType, currentProject, setChatHistory]);

  return { loading };
};
