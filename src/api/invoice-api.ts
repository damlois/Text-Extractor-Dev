import { DataSourceInfo, TemplateItem, TemplateResponse } from "../types";
import apiClient from "../service/apiClient";

export const invoiceProcessorApi = {
  configureDataSource: (data: DataSourceInfo) =>
    apiClient.post("/invoices/data-sources", data),

  getTemplate: () =>
    apiClient.get<TemplateResponse>("/invoices/template"),

  updateTemplate: (items: TemplateItem[]) =>
    apiClient.put("/invoices/template", { items }),
};
