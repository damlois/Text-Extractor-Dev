import axios from 'axios';
import { AnalysisInstruction, ChatMessage, ChatSession, Project, User } from '../types';

const api = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
});

export const fileProcessorApi = {
  getCurrentUser: () => 
    api.get<User>('/users/me'),

  createProject: (data: { name: string; description?: string }) =>
    api.post<Project>('/projects', data),
  
  getProjects: () =>
    api.get<Project[]>('/projects'),

  uploadFiles: (projectId: number, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach(file => {
      formData.append('files', file);
    });
    return api.post(`/projects/${projectId}/files`, formData);
  },

  createChatSession: (projectId: number, data: {
    name?: string;
    file_ids: number[];
    session_type: 'document' | 'image';
  }) =>
    api.post<ChatSession>(`/projects/${projectId}/chat-sessions`, data),

  getChatSessions: (projectId: number, type?: 'document' | 'image') =>
    api.get<ChatSession[]>(`/projects/${projectId}/chat-sessions`, {
      params: { session_type: type }
    }),

  sendMessage: (sessionId: number, data: {
    content: string;
    additional_data?: Record<string, any>;
  }) =>
    api.post<{ response: string }>(`/chat-sessions/${sessionId}/messages`, data),

  getChatMessages: (sessionId: number) =>
    api.get<{ messages: ChatMessage[] }>(`/chat-sessions/${sessionId}/messages`),

  runAnalysis: (projectId: number, instructions: AnalysisInstruction[]) =>
    api.post(`/projects/${projectId}/analyze`, { instructions }),
};