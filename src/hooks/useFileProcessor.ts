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

export const useChatSessions = (type?: 'document' | 'image') => {
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
    session_type: 'document' | 'image';
  }) => {
    if (!currentProject) throw new Error('No project selected');

    // const response = await fileProcessorApi.createChatSession(currentProject.id, data);
    // setChatSessions(prevSessions => [...prevSessions, response.data]);
    // return response.data;
  };

  return { createChatSession };
};

export const useChatMessages = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   fileProcessorApi.getChatMessages(sessionId).then(res => {
  //     setChatMessages(res.data.messages);
  //     setLoading(false);
  //   });
  // }, [sessionId, setChatMessages]);

  return { loading };
};

export const useSendMessage = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();

  // const sendMessage = async (data: { content: string; additional_data?: Record<string, any> }) => {
  //   const response = await fileProcessorApi.sendMessage(sessionId, data);
  //   setChatMessages((prevMessages: ChatMessage[]) => [...prevMessages, response.data as unknown as ChatMessage]);
  //   return response.data;
  // };

  // return { sendMessage };
};
