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
  project_id: string;
  name: string;
  description?: string;
  created_at: string;
  files_data: ExtractedText[];
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
  created_at?: string;
  content: string;
}

export interface Instruction {
  title: string;
  description: string;
  data_type?: string;
}

export type SessionType = "New" | "Existing";
