import { ProcessedInvoice } from "../../../../../../../types";

export const formatInvoiceAndCreateMap = (invoices: any) => {
  const invoiceMapById: Record<string, ProcessedInvoice> = {};

  const formattedInvoices = invoices.map((item: any) => {
    const formattedInvoice = {
      ...item,
      sender: item.email_metadata.sender,
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
