import {
  ChatMessage,
  Instruction,
  Project,
  User,
  chatHistoryRecord,
  FileResponse,
  ImageData,
} from "../types";
import apiClient from "../service/apiClient";


export const fileProcessorApi = {
  getCurrentUser: () => apiClient.get<User>("/users/me"),

  createProject: (data: { name: string; description?: string }) =>
    apiClient.post<{ data: Project }>("/projects", data),

  getProjects: () => apiClient.get<{ data: Project[] }>("/projects"),

  uploadFiles: (projectId: string, files: FileList) => {
    const formData = new FormData();
    Array.from(files).forEach((file) => {
      formData.append("files", file);
    });
    return apiClient.post(`/projects/${projectId}/files`, formData);
  },

  analyzeFiles: (projectId: string, instructions: Instruction[]) =>
    apiClient.post(`/projects/${projectId}/analyze`, { instructions }),

  getProjectImages: (projectId: string) =>
    apiClient.get<{ data: ImageData[] }>(`/projects/${projectId}/images`),

  getProjectAnalyses: (projectId: string) =>
    apiClient.get(`/projects/${projectId}/analyses`),

  getFiles: (projectId: string) =>
    apiClient.get<{data: FileResponse[]}>(`/projects/${projectId}/files`),

  sendMessage: (
    projectId: string,
    data: {
      prompt: string;
      chat_type: "document" | "image";
      image_data?: string;
      image_url?: string;
      session_id?: string;
    }
  ) => apiClient.post<ChatMessage>(`/projects/${projectId}/chat`, data),

  getChatHistory: (projectId: string, chatType?: "document" | "image") =>
    apiClient.get<{ data: chatHistoryRecord[] }>(
      `/projects/${projectId}/chat-history`,
      {
        params: { chat_type: chatType },
      }
    ),
};
