import { useQuery, useMutation } from '@tanstack/react-query';
import { fileProcessorApi } from '../api/api';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: () => fileProcessorApi.getCurrentUser().then(res => res.data),
  });
};

export const useProjects = () => {
  return useQuery({
    queryKey: ['projects'],
    queryFn: () => fileProcessorApi.getProjects().then(res => res.data),
  });
};

export const useCreateProject = () => {
  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      fileProcessorApi.createProject(data).then(res => res.data),
  });
};

export const useUploadFiles = (projectId: number) => {
  return useMutation({
    mutationFn: (files: FileList) =>
      fileProcessorApi.uploadFiles(projectId, files),
  });
};

export const useChatSessions = (projectId: number, type?: 'document' | 'image') => {
  return useQuery({
    queryKey: ['chatSessions', projectId, type],
    queryFn: () => fileProcessorApi.getChatSessions(projectId, type).then(res => res.data),
  });
};

export const useCreateChatSession = () => {
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
  });
};

export const useChatMessages = (sessionId: number) => {
  return useQuery({
    queryKey: ['chatMessages', sessionId],
    queryFn: () => fileProcessorApi.getChatMessages(sessionId).then(res => res.data.messages),
  });
};

export const useSendMessage = (sessionId: number) => {
  return useMutation({
    mutationFn: (data: { content: string; additional_data?: Record<string, any> }) =>
      fileProcessorApi.sendMessage(sessionId, data).then(res => res.data),
  });
};