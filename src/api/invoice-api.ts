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
  User,
  UserResponse,
  RoleResponse,
  Role,
} from "../types";
import apiClient from "../service/apiClient";

export const invoiceProcessorApi = {
  configureDataSource: (data: DataSourceInfo) =>
    apiClient.post("/invoices/data-sources", data),

  getTemplate: (dataSourceId?: string) =>
    apiClient.get<TemplateResponse>(
      `/invoices/template${
        dataSourceId ? `?data_source_id=${dataSourceId}` : ""
      }`
    ),

  updateTemplate: (dataSourceId: string | undefined, items: TemplateItem[]) =>
    apiClient.put(
      `/invoices/template${
        dataSourceId ? `?data_source_id=${dataSourceId}` : ""
      }`,
      { items }
    ),

  getProcessedInvoices: (params: ProcessedInvoicesParams) =>
    apiClient.get<ProcessedInvoicesResponse>(
      `/invoices/processed?page=${params.page}&size=${params.size}`
    ),

  updateInvoiceStatus: (status: string, invoiceIds: string[]) =>
    apiClient.patch(`invoices/status?status=${status}`, invoiceIds),

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
      const response = await apiClient.get<{ data: boolean; message: string }>(
        "/users/has-admin"
      );
      return response;
    } catch (error) {
      console.error("Error checking if organization has admin");
      throw error;
    }
  },

  createUser: async (UserResponse: User) => {
    const response = await apiClient.post<{
      data: UserResponse;
    }>("/users", UserResponse);

    return response;
  },

  getUsers: async () => await apiClient.get<{ data: UserResponse[] }>("/users"),

  getRoles: async () => await apiClient.get<{ data: RoleResponse[] }>("/roles"),

  addRole: async (data: Role) => await apiClient.post("/roles", data),

  updateRole: async (roleId: string, data: Role) => await apiClient.put(`/roles/${roleId}`, data),
};
