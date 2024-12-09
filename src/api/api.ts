import axios from "axios";
import {
  ChatMessage,
  Instruction,
  Project,
  User,
  chatHistoryRecord,
  FileResponse,
} from "../types";

const api = axios.create({
  baseURL: process.env.REACT_APP_DEV_API_URL,
});

export const fileProcessorApi = {
  getCurrentUser: () => api.get<User>("/users/me"),

  createProject: (data: { name: string; description?: string }) =>
    api.post<{ data: Project }>("/projects", data),

  getProjects: () => api.get<{ data: Project[] }>("/projects"),

  uploadFiles: (projectId: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    return api.post(`/projects/${projectId}/files`, formData);
  },

  analyzeFiles: (projectId: string, instructions: Instruction[]) =>
    api.post(`/projects/${projectId}/analyze`, { instructions }),

  getProjectAnalyses: (projectId: string) =>
    api.get(`/projects/${projectId}/analyses`),

  getFiles: (projectId: string) =>
    api.get<FileResponse[]>(`/projects/${projectId}/files`),

  sendMessage: (
    projectId: string,
    data: {
      prompt: string;
      chat_type: "document" | "image";
      image_data?: string;
    }
  ) => api.post<ChatMessage>(`/projects/${projectId}/chat`, data),

  getChatHistory: (projectId: string, chatType?: "document" | "image") =>
    api.get<{ history: chatHistoryRecord[] }>(
      `/projects/${projectId}/chat-history`,
      {
        params: { chat_type: chatType },
      }
    ),
};
