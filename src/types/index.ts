export type Message = {
  text: string;
  from: "user" | "model" | "loader";
  image?: string;
};

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

export interface DataSourceInfo {
  id?: string;
  name: string;
  type: string;
  // Add other relevant fields based on your data source requirements
}

export interface DataSourceDetails {
  data_source_id: string;
  source_type: string;
  username: string;
  password: string;
  server_name: string;
  port: number;
  status: "active" | "inactive";
}

export interface DataSourceResponse {
  status_code: number;
  status: string;
  message: string;
  data: DataSourceDetails[];
}

export interface ToggleStatusResponse {
  status_code: number;
  status: string;
  message: string;
  data: Record<string, never>;
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

export type DynamicValue =
  | string
  | number
  | null
  | boolean
  | DynamicObject
  | DynamicValue[];
export interface DynamicObject {
  [key: string]: DynamicValue;
}

export interface ProcessedInvoice {
  id: string;
  file_name: string;
  content: string;
  extracted_content: DynamicObject;
  image_data: string;
  email_metadata: {
    sender: string;
    receiver: string;
  };
  source?: string;
  processing_status: string;
  created_at: string;
  flag: string;
}

export interface InvoiceDetailsResponse {
  status_code: number;
  status: string;
  message: string;
  data: ProcessedInvoice;
}

export interface BatchInvoiceDetailsResponse {
  status_code: number;
  status: string;
  message: string;
  data: ProcessedInvoice[];
}

export interface ProcessedInvoicesResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    invoices: ProcessedInvoice[];
    total: number;
    page: number;
    size: number;
  };
}

export interface ProcessedInvoicesParams {
  page: number;
  size: number;
}

export interface BreadCrumb {
  label: string;
  path?: string;
}

export type ExtractionStatus = "Successful" | "Failed" | null;

export interface ExtractionHistoryFilter {
  senders?: string[];
  status?: ExtractionStatus;
  dateFrom?: string;
  dateTo?: string;
}

export interface ChatMessage {
  prompt: string;
  response: string;
  created_at: string;
}

export interface ChatSession {
  session_id: string;
  invoice_ids: string[];
  messages: ChatMessage[];
  created_at: string;
}

export interface ChatResponse {
  status_code: number;
  status: string;
  message: string;
  data: ChatSession;
}

export interface ChatRequest {
  session_id?: string;
  invoice_ids: string[];
  prompt: string;
}

export interface SuggestedPromptsResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    prompts: {
      [key: string]: string;
    };
  };
}

export interface InvoiceMetricsResponse {
  status_code: number;
  status: string;
  message: string;
  data: {
    [key: string]: number;
  };
}

export interface ChatSessionSummary {
  session_id: string;
  invoice_ids: string[];
  created_at: string;
  last_message: string;
  message_count: number;
  title: string;
}

export interface ChatSessionsResponse {
  status_code: number;
  status: string;
  message: string;
  data: ChatSessionSummary[];
}

export interface User {
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  password?: string;
  role?: string;
  is_invited: boolean;
}

export interface UserResponse {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  username: string;
  role: string | undefined;
  status: string;
}
