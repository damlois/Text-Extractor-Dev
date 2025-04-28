import { camelCase } from "lodash";
import { ProcessedInvoice } from "../../../../../types";

export const formatInvoiceAndCreateMap = (invoices: any) => {
  const invoiceMapById: Record<string, ProcessedInvoice> = {};

  const formattedInvoices = invoices.map((item: any) => {
    const formattedInvoice = {
      ...item,
      review_status: "qa_passed",
      confidence_level: "0.8",
      processing_status:
        item.processing_status === "COMPLETED"
          ? "Successful"
          : item.processing_status,
    };

    if (!invoiceMapById[item.id]) {
      invoiceMapById[item.id] = formattedInvoice;
    }

    return formattedInvoice;
  });

  return { formattedInvoices, invoiceMapById };
};

export const standardizeInvoice = (
  invoice: Record<string, any>
): Record<string, any> => {
  return Object.keys(invoice).reduce<Record<string, any>>((acc, key) => {
    const formattedKey = camelCase(key);
    acc[formattedKey] = invoice[key] ?? "N/A";
    return acc;
  }, {});
};

export const formatInvoiceData = (invoices: ProcessedInvoice[]) => {
  return invoices.map(({ id, file_name, extracted_content }) => {
    return standardizeInvoice({
      id,
      file_name,
      ...extracted_content,
    });
  });
};
