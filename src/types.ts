export type Message = {
  text: string;
  from: "user" | "model" | "loader";
  image?: string;
};

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  files_data: {
    files: ExtractedText[];
    message?: string;
  };
  analysis_data: any;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface chatHistoryRecord {
  prompt: string;
  response: string;
  type: string;
  timestamp: string;
}

export interface User {
  id: string;
  username: string;
  role: string;
}

export interface FileResponse {
  id: number;
  file_name: string;
  content: string;
  created_at: string;
}

export interface ExtractedText {
  id?: number;
  file_name: string;
  status?: string;
  content: string;
}

export interface Instruction {
  title: string;
  description: string;
  data_type?: string;
}

export type SessionType = "New" | "Existing";
