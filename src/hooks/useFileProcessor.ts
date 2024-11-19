import { useState, useEffect } from 'react';
import { fileProcessorApi } from '../api/api';
import { useFileProcessor } from '../context/FileProcessorContext';
import { Project, FileResponse, ChatMessage } from '../types';

export const useCurrentUser = () => {
  const { setCurrentUser } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getCurrentUser().then(res => {
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
    fileProcessorApi.getProjects().then(res => {
      setProjects(res.data);
      setLoading(false);
    });
  }, [setProjects]);

  return { loading };
};

export const useCreateProject = () => {
  const { setProjects, setCurrentProject } = useFileProcessor();

  const createProject = async (data: { name: string; description?: string }) => {
    const response = await fileProcessorApi.createProject(data);
    setCurrentProject(response.data);
    setProjects(prevProjects => [...prevProjects, response.data]);
    return response.data;
  };

  return { createProject };
};

export const useUploadFiles = () => {
  const { currentProject, setProjects } = useFileProcessor();

  const uploadFiles = async (files: File[]) => {
    if (!currentProject) throw new Error('No project selected');

    const fileList = new DataTransfer();
    files.forEach(file => fileList.items.add(file));

    const response = await fileProcessorApi.uploadFiles(currentProject.id, fileList.files);
    setProjects(prevProjects => prevProjects.map(project =>
      project.id === currentProject.id ? { ...project, filesData: response.data } : project
    ));
    return response.data;
  };

  return { uploadFiles };
};

export const useSendMessage = () => {
  const { currentProject } = useFileProcessor();

  const sendMessage = async (data: {
    prompt: string;
    chat_type: 'document' | 'image';
    image_data?: string;
  }) => {
    if (!currentProject) throw new Error('No project selected');

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
