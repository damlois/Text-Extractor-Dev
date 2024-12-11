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
  files_data: FileResponse[];
  analysis_data: any;
  image_data: ImageData[];
}

export interface ImageData {
  craeted_at: string;
  image_name: string;
  image_path: string;
  page_number: string;
  image_path_url?: string;
  file_name: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

export interface chatHistoryRecord {
  prompt: string;
  response: string;
  image_url?: string;
  session_id: string;
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


export interface Instruction {
  title: string;
  description: string;
  data_type?: string;
}

export type SessionType = "New" | "Existing";
