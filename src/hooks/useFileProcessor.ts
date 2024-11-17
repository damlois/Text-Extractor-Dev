import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fileProcessorApi } from '../api/api';
import { useFileProcessor } from '../context/FileProcessorContext';

export const useCurrentUser = () => {
  const { setCurrentUser } = useFileProcessor();
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fileProcessorApi.getCurrentUser().then(res => {
      setCurrentUser(res.data);
      return res.data;
    }),
  });
};

export const useProjects = () => {
  const { setProjects } = useFileProcessor();
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fileProcessorApi.getProjects().then(res => {
      setProjects(res.data);
      return res.data;
    }),
  });
};

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      fileProcessorApi.createProject(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useUploadFiles = (projectId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (files: FileList) =>
      fileProcessorApi.uploadFiles(projectId, files),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export const useChatSessions = (projectId: number, type?: 'document' | 'image') => {
  const { setChatSessions } = useFileProcessor();
  return useQuery({
    queryKey: ['chatSessions', projectId, type],
    queryFn: () => fileProcessorApi.getChatSessions(projectId, type).then(res => {
      setChatSessions(res.data);
      return res.data;
    }),
  });
};

export const useCreateChatSession = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      projectId: number;
      name?: string;
      file_ids: number[];
      session_type: 'document' | 'image';
    }) =>
      fileProcessorApi.createChatSession(data.projectId, {
        name: data.name,
        file_ids: data.file_ids,
        session_type: data.session_type,
      }).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatSessions'] });
    },
  });
};

export const useChatMessages = (sessionId: number) => {
  const { setChatMessages } = useFileProcessor();
  return useQuery({
    queryKey: ['chatMessages', sessionId],
    queryFn: () => fileProcessorApi.getChatMessages(sessionId).then(res => {
      setChatMessages(res.data.messages);
      return res.data.messages;
    }),
  });
};

export const useSendMessage = (sessionId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: { content: string; additional_data?: Record<string, any> }) =>
      fileProcessorApi.sendMessage(sessionId, data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chatMessages', sessionId] });
    },
  });
};
