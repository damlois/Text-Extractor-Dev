import { useInvoiceProcessor } from "../apps/invoiceApp/context/InvoiceProcessorContext";
import { invoiceProcessorApi } from "../api/invoice-api";
import { DataSourceInfo } from "../types";

export const useConfigureDataSource = () => {
  const { setCurrentDataSource } = useInvoiceProcessor();

  const configureDataSource = async (data: DataSourceInfo) => {
    const response = await invoiceProcessorApi.configureDataSource(data);

    setCurrentDataSource(response.data);

    return response.data;
  };

  return { configureDataSource };
};
