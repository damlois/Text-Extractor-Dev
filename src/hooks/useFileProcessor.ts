<<<<<<< HEAD
import { useState, useEffect } from "react";
import { fileProcessorApi } from "../api/api";
import { useFileProcessor } from "../context/FileProcessorContext";
import { Project, ChatSession, ChatMessage, Instruction } from "../types";
=======
import { useState, useEffect } from 'react';
import { fileProcessorApi } from '../api/api';
import { useFileProcessor } from '../context/FileProcessorContext';
import { Project, FileResponse, ChatMessage } from '../types';
>>>>>>> e2dcecfada3e0846af6e44149574b634ed875eac

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
  const { setProjects, setCurrentProject } = useFileProcessor();

  const createProject = async (data: {
    name: string;
    description?: string;
  }) => {
    const response = await fileProcessorApi.createProject(data);
    setCurrentProject(response.data);
    setProjects((prevProjects) => [...prevProjects, response.data]);
    return response.data;
  };

  return { createProject };
};

export const useUploadFiles = () => {
  const { currentProject, setProjects } = useFileProcessor();

  const uploadFiles = async (files: File[]) => {
    if (!currentProject) throw new Error("No project selected");

    const fileList = new DataTransfer();
    files.forEach((file) => fileList.items.add(file));

    const response = await fileProcessorApi.uploadFiles(
      currentProject.id,
      fileList.files
    );
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

<<<<<<< HEAD
export const useAnalyzeFiles = () => {
  const { currentProject, setProjects } = useFileProcessor();

  const analyzeFiles = async (instructions: Instruction[]) => {
    if (!currentProject) throw new Error("No project selected");


    console.log("about to analyze")
    const response = await fileProcessorApi.analyzeFiles(
      currentProject.id,
      instructions
    );

    setProjects((prevProjects) =>
      prevProjects.map((project) =>
        project.id === currentProject.id
          ? { ...project, analysis_data: response.data.analysis_data }
          : project
      )
    );

    return response.data;
  };

  return { analyzeFiles };
};

export const useChatSessions = (type?: "document" | "image") => {
  const { currentProject, setChatSessions } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentProject) return;

    // fileProcessorApi.getChatSessions(currentProject.id, type).then(res => {
    //   setChatSessions(res.data);
    //   setLoading(false);
    // });
  }, [currentProject, type, setChatSessions]);

  return { loading };
};

export const useCreateChatSession = () => {
  const { currentProject, setChatSessions } = useFileProcessor();

  const createChatSession = async (data: {
    name?: string;
    file_ids: number[];
    session_type: "document" | "image";
=======
export const useSendMessage = () => {
  const { currentProject } = useFileProcessor();

  const sendMessage = async (data: {
    prompt: string;
    chat_type: 'document' | 'image';
    image_data?: string;
>>>>>>> e2dcecfada3e0846af6e44149574b634ed875eac
  }) => {
    if (!currentProject) throw new Error("No project selected");

    const response = await fileProcessorApi.sendMessage(currentProject.id, data);
    return response.data;
  };

  return { sendMessage };
};


export const useChatHistory = (chatType: 'document' | 'image' | undefined) => {
  const { currentProject, setChatHistory } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChatHistory = async () => {
      if (!currentProject) return;

      const response = await fileProcessorApi.getChatHistory(currentProject.id, chatType);
      setChatHistory(response.data.history);
      setLoading(false);
    };

    fetchChatHistory();
  }, [chatType, currentProject, setChatHistory]);

  return { loading };
}
