import { DocumentEditor } from "../../../types";

export type ExtractionHistoryTableInfo = {
  key: React.Key;
  fileName: string;
  id: string;
  sourceType: string;
  sender: string;
  date: string;
  status: string;
};

export type DuplicateDocumentItemResponse = {
  id: string;
  file_name: string;
  metadata: {
    sender: string;
    receiver: string;
  };
  source?: string;
  processing_status: string;
  created_at: string;
  updated_at: string;
  extracted_content: any;
  review_status: ReviewStatus;
  editor: DocumentEditor;
};

export type ModalType = "Not-Allowed" | "Ignore" | "Archive";

export type DuplicateDocumentsResponse = {
  file_hash: string;
  documents: DuplicateDocumentItemResponse[];
};

export type DuplicateDocumentsFileHashMap = Record<
  string,
  { documents: DuplicateDocumentItemResponse[]; visible: boolean }
>;

export type StatusType = "successful" | "processing" | "failed" | "retry_in_progress";

export type Header = "processing_status" | "confidence" | "review_status";

export type UserStatus = 'active' | 'inactive';

export type ReviewStatus =
  | "pending"
  | "in_review"
  | "reviewed"
  | "not_applicable";

export type RegularField = {
  field: string;
  value: string;
  confidence?: number;
};

export type ItemField = {
  label: string;
  data: any;
  confidence?: number;
};

export type EditedFields = {
  regular: Record<string, string>;
  items: Record<number, any>;
};

export type ReviewActionType = "approve_qa" | "save_edit";

export type Confidence =
  | number
  | Record<string, number>
  | Array<Record<string, number>>;
