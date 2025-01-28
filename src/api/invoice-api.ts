import { DataSourceInfo, ProcessedInvoicesResponse, ProcessedInvoicesParams, TemplateItem, TemplateResponse, DataSourceResponse, ToggleStatusResponse } from "../types";
import apiClient from "../service/apiClient";

export const invoiceProcessorApi = {
  configureDataSource: (data: DataSourceInfo) =>
    apiClient.post("/invoices/data-sources", data),

  getTemplate: () =>
    apiClient.get<TemplateResponse>("/invoices/template"),

  updateTemplate: (items: TemplateItem[]) =>
    apiClient.put("/invoices/template", { items }),

  getProcessedInvoices: (params: ProcessedInvoicesParams) =>
    apiClient.get<ProcessedInvoicesResponse>(`/invoices/processed?page=${params.page}&size=${params.size}`),

  getDataSourceDetails: (dataSourceId: string) =>

    apiClient.get<DataSourceResponse>(`/invoices/data-sources/${dataSourceId}`),

  toggleDataSourceStatus: (dataSourceId: string, status: "active" | "inactive") =>
    apiClient.post<ToggleStatusResponse>(`/invoices/data-sources/${dataSourceId}/toggle-status`, { status }),
};

