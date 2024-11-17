import { useState, useEffect } from 'react';
import { fileProcessorApi } from '../api/api';
import { useFileProcessor } from '../context/FileProcessorContext';
import { Project, ChatSession, ChatMessage } from '../types';

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
  const { setProjects } = useFileProcessor();

  const createProject = async (data: { name: string; description?: string }) => {
    const response = await fileProcessorApi.createProject(data);
    setProjects((prevProjects: Project[]) => [...prevProjects, response.data]);
    return response.data;
  };

  return { createProject };
};

export const useUploadFiles = (projectId: number) => {
  const { setProjects } = useFileProcessor();

  const uploadFiles = async (files: File[]) => {
    const fileList = new DataTransfer();
    files.forEach(file => fileList.items.add(file));

    const response = await fileProcessorApi.uploadFiles(projectId, fileList.files);
    setProjects((prevProjects: Project[]) => prevProjects.map(project =>
      project.id === projectId ? { ...project, files: response.data } : project
    ));
    return response.data;
  };

  return { uploadFiles };
};

export const useChatSessions = (projectId: number, type?: 'document' | 'image') => {
  const { setChatSessions } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getChatSessions(projectId, type).then(res => {
      setChatSessions(res.data);
      setLoading(false);
    });
  }, [projectId, type, setChatSessions]);

  return { loading };
};

export const useCreateChatSession = () => {
  const { setChatSessions } = useFileProcessor();

  const createChatSession = async (data: {
    projectId: number;
    name?: string;
    file_ids: number[];
    session_type: 'document' | 'image';
  }) => {
    const response = await fileProcessorApi.createChatSession(data.projectId, {
      name: data.name,
      file_ids: data.file_ids,
      session_type: data.session_type,
    });
    setChatSessions((prevSessions: ChatSession[]) => [...prevSessions, response.data]);
    return response.data;
  };

  return { createChatSession };
};

export const useChatMessages = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fileProcessorApi.getChatMessages(sessionId).then(res => {
      setChatMessages(res.data.messages);
      setLoading(false);
    });
  }, [sessionId, setChatMessages]);

  return { loading };
};

export const useSendMessage = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();

  const sendMessage = async (data: { content: string; additional_data?: Record<string, any> }) => {
    const response = await fileProcessorApi.sendMessage(sessionId, data);
    setChatMessages((prevMessages: ChatMessage[]) => [...prevMessages, response.data as unknown as ChatMessage]);
    return response.data;
  };

  return { sendMessage };
};
