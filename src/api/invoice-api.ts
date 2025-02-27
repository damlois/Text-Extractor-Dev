import {
  DataSourceInfo,
  ProcessedInvoicesResponse,
  ProcessedInvoicesParams,
  TemplateItem,
  TemplateResponse,
  DataSourceResponse,
  ToggleStatusResponse,
  ChatResponse,
  ChatRequest,
  InvoiceMetricsResponse,
  SuggestedPromptsResponse,
  ChatSessionsResponse,
} from "../types";
import apiClient from "../service/apiClient";

export const invoiceProcessorApi = {
  configureDataSource: (data: DataSourceInfo) =>
    apiClient.post("/invoices/data-sources", data),

  getTemplate: () => apiClient.get<TemplateResponse>("/invoices/template"),

  updateTemplate: (items: TemplateItem[]) =>
    apiClient.put("/invoices/template", { items }),

  getProcessedInvoices: (params: ProcessedInvoicesParams) =>
    apiClient.get<ProcessedInvoicesResponse>(
      `/invoices/processed?page=${params.page}&size=${params.size}`
    ),

  getDataSourceDetails: () =>
    apiClient.get<DataSourceResponse>(`/invoices/data-sources`),

  toggleDataSourceStatus: (
    dataSourceId: string,
    status: "active" | "inactive"
  ) =>
    apiClient.post<ToggleStatusResponse>(
      `/invoices/data-sources/${dataSourceId}/toggle-status`,
      { status }
    ),

  chatWithInvoices: (data: ChatRequest) =>
    apiClient.post<ChatResponse>("/invoices/chat", data),

  getChatSession: (sessionId: string) =>
    apiClient.get<ChatResponse>(`/invoices/chat-sessions/${sessionId}`),

  getChatSessions: () =>
    apiClient.get<ChatSessionsResponse>("/invoices/chat-sessions"),

  getInvoiceMetrics: () =>
    apiClient.get<InvoiceMetricsResponse>("/invoices/invoice-metrics"),

  getInvoiceDetails: async (invoiceId: string) => {
    try {
      const response = await apiClient.get(`/invoices/${invoiceId}`);
      return response;
    } catch (error) {
      console.error("Error fetching invoice details:", error);
      throw error;
    }
  },

  getBatchInvoiceDetails: async (invoiceIds: string[]) => {
    try {
      const response = await apiClient.post("/invoices/batch", invoiceIds);
      return response;
    } catch (error) {
      console.error("Error fetching batch invoice details:", error);
      throw error;
    }
  },

  getSuggestedPrompts: async (invoiceIds: string[], sessionId?: string) => {
    try {
      const queryParams = new URLSearchParams();
      invoiceIds.forEach((id) => queryParams.append("invoice_ids", id));
      if (sessionId) {
        queryParams.append("session_id", sessionId);
      }
      const response = await apiClient.get<SuggestedPromptsResponse>(
        `/invoices/chat/suggested-prompts?${queryParams}`
      );
      return response;
    } catch (error) {
      console.error("Error fetching suggested prompts:", error);
      throw error;
    }
  },

  checkOrgHasAdmin: async () => {
    try {
      const response = await apiClient.get<{ data: boolean }>(
        "/users/has-admin"
      );
      return response.data.data;
    } catch (error) {
      console.error("Error checking if organization has admin");
      throw error;
    }
  },
};
