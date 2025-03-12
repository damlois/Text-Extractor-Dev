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

export type ModalType = "Not-Allowed" | "Ignore" | "Archive";

export type DuplicateTableData = {
  invoices: ProcessedInvoice[];
  visible: boolean;
};
