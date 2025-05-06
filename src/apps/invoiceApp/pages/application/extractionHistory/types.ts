export type ExtractionHistoryTableInfo = {
  key: React.Key;
  fileName: string;
  id: string;
  sourceType: string;
  sender: string;
  date: string;
  status: string;
};

export type DuplicateInvoiceItemResponse = {
  id: string;
  file_name: string;
  metadata: {
    sender: string;
    receiver: string;
  };
  source?: string;
  processing_status: string;
  created_at: string;
  extracted_content: any;
  review_status: ReviewStatus;
};

export type ModalType = "Not-Allowed" | "Ignore" | "Archive";

export type DuplicateInvoicesResponse = {
  file_hash: string;
  invoices: DuplicateInvoiceItemResponse[];
};

export type DuplicateInvoicesFileHashMap = Record<
  string,
  { invoices: DuplicateInvoiceItemResponse[]; visible: boolean }
>;

export type StatusType = "successful" | "processing" | "failed";

export type Header = "processing_status" | "confidence" | "review_status";

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
