import { ProcessedInvoice, ExtractionHistoryFilter } from "../types";

export const filterInvoices = (
  invoices: ProcessedInvoice[],
  filters: ExtractionHistoryFilter | null
): ProcessedInvoice[] => {
  if (!filters) return invoices;

  return invoices.filter((invoice) => {
    // Filter by senders
    if (filters.senders?.length && !filters.senders.includes(invoice.sender)) {
      return false;
    }

    // Filter by status
    if (filters.status && invoice.processing_status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const invoiceDate = new Date(invoice.created_at);

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom.split('-').reverse().join('-'));
        if (invoiceDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo.split('-').reverse().join('-'));
        if (invoiceDate > toDate) return false;
      }
    }

    return true;
  });
};
