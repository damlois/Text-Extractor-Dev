import { ProcessedInvoice } from "../../../../../types";

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
  status: string;
  created_at: string;
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
  | "qa_passed"
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
