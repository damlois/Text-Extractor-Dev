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
  DataSourceDetails,
  PermissionGroup,
  ImagePagesResponse,
} from "../types";
import apiClient from "../service/apiClient";
import { ReviewStatus } from "../apps/invoiceApp/pages/application/extractionHistory/types";
import keycloakService from "../service/keycloakService";

export const invoiceProcessorApi = {
  configureDataSource: (data: DataSourceInfo) =>
    apiClient.post<{ data: DataSourceDetails }>("/invoices/data-sources", data),

  getTemplate: (dataSourceId?: string) =>
    apiClient.get<TemplateResponse>(
      `/invoices/template?data_source_id=${dataSourceId}`
    ),

  updateTemplate: (dataSourceId: string | undefined, items: TemplateItem[]) =>
    apiClient.put(`/invoices/template?data_source_id=${dataSourceId}`, {
      items,
    }),

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

  registerAdmin: async (UserResponse: User) => {
    const response = await apiClient.post<{
      data: UserResponse;
    }>("/users/admin/register", UserResponse);

    return response;
  },

  inviteUser: async (UserResponse: User) => {
    const response = await apiClient.post<{
      data: UserResponse;
    }>("/users/invite", UserResponse);

    return response;
  },

  getUsers: async () => await apiClient.get<{ data: UserResponse[] }>("/users"),

  getRoles: async () => await apiClient.get<{ data: RoleResponse[] }>("/roles"),

  getAllPermissions: async () =>
    await apiClient.get<{ data: { permissions: PermissionGroup[] } }>(
      "/roles/permissions"
    ),

  getUserPermissions: async () => await apiClient.get("/users/me/role"),

  addRole: async (data: Role) => await apiClient.post("/roles", data),

  updateRole: async (roleId: string, data: Role) =>
    await apiClient.put(`/roles/${roleId}`, data),

  getInvoiceImage: async (invoiceId: string) =>
    await apiClient.get<{ data: ImagePagesResponse }>(
      `/invoices/${invoiceId}/image`
    ),

  editInvoiceExtraction: async (invoiceId: string, data: any) =>
    await apiClient.put(`/invoices/${invoiceId}/edit`, data),

  updateReviewStatus: async (
    invoiceId: string,
    data: { status: ReviewStatus }
  ) => await apiClient.patch(`/invoices/${invoiceId}/review-status`, data),

  updateReviewStatusWithFetch: async (
    invoiceId: string,
    status: ReviewStatus
  ) => {
    const token = keycloakService.getToken();
    const body = JSON.stringify({ status });

    try {
      await fetch(
        `${process.env.REACT_APP_API_URL}/invoices/${invoiceId}/review-status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
          keepalive: true, // Enables background sending
        }
      );
    } catch (error) {
      console.error("Error updating review status:", error);
    }
  },
};
