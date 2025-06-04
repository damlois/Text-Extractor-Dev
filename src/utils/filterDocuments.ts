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
      let currentReviewStatus = filters.reviewStatus.map(status => {
        if (status === "Pending") {
          return "pending"
        } else if (status === "In Review") {
          return "in_review"
        } else if (status === "QA Passed") {
          return "reviewed"
        } else if (status === "N/A") {
          return "n_a"
        }
        return status
      }) 
      if (!currentReviewStatus.some(status => status === document.review_status)) {
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
