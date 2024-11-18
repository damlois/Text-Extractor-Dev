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

export interface ExtractedText {
  id: number;
  file_name: string;
  status: string;
  content: string;
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  created_at: string;
  files_data: {
    files: ExtractedText[];
    message: string;
  };
  analysis_data: any;
}

export interface ChatSession {
  id: number;
  name?: string;
  files: number[];
  session_type: "document" | "image";
  created_at: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  additional_data?: Record<string, any>;
}

export interface AnalysisInstruction {
  title: string;
  data_type: "string" | "number";
  description: string;
}

export interface Instruction {
  title: string;
  description: string;
  data_type?: string;
}
