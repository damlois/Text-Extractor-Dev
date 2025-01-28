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

export interface DataSourceInfo {
  id?: string;
  name: string;
  type: string;
  // Add other relevant fields based on your data source requirements
}

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface TemplateItem {
  label: string;
  description: string;
}

export interface TemplateResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    items: TemplateItem[];
  };
}

export interface LabelSetupTemplateProps {
  buttonComponent: (props: { loading: boolean }) => React.ReactNode;
  onSuccessCallback?: () => void;
  className?: string;
}

export interface LabelInfo {
  key: string;
  label: string;
  description: string;
}

export interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: keyof LabelInfo;
  title: string;
  inputType: "text";
  record: LabelInfo;
}
