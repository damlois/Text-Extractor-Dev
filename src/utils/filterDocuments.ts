import { ProcessedDocument, ExtractionHistoryFilter } from "../types";

export const filterDocuments = (
  documents: ProcessedDocument[],
  filters: ExtractionHistoryFilter | null
): ProcessedDocument[] => {
  if (!filters) return documents;

  return documents.filter((document) => {
    // Filter by senders
    if (filters.senders?.length && !filters.senders.includes(document.email_metadata.sender)) {
      return false;
    }

    // Filter by extraction status
    if (filters.status && document.processing_status.toLowerCase() !== filters.status.toLowerCase()) {
      return false;
    }

    // Filter by review status
    if (filters.reviewStatus?.length) {
      const currentReviewStatus = document.review_status.replace(/_/g, " ");
      if (!filters.reviewStatus.some(status => status.toLowerCase() === currentReviewStatus.toLowerCase())) {
        return false;
      }
    }

    // Filter by date range
    if (filters.dateFrom || filters.dateTo) {
      const documentDate = new Date(document.created_at);

      if (filters.dateFrom) {
        const fromDate = new Date(filters.dateFrom.split('-').reverse().join('-'));
        if (documentDate < fromDate) return false;
      }

      if (filters.dateTo) {
        const toDate = new Date(filters.dateTo.split('-').reverse().join('-'));
        if (documentDate > toDate) return false;
      }
    }

    return true;
  });
};
