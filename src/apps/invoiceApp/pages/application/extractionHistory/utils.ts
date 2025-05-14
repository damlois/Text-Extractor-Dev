import { camelCase } from "lodash";
import { ProcessedInvoice } from "../../../../../types";
import { formatExtractionValue } from "../../../../../utils";
import { ItemField, RegularField } from "./types";

export const formatToReadableDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = hours >= 12 ? "pm" : "am";
  const formattedHour = hours % 12 || 12;

  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();

  return `${formattedHour}:${minutes}${ampm}, ${month}/${day}/${year}`;
};

export const formatInvoiceAndCreateMap = (invoices: any) => {
  const invoiceMapById: Record<string, ProcessedInvoice> = {};

  const formattedInvoices = invoices.map((item: any) => {
    const extractedContent = item.extracted_content;
    const overallConfidence =
      extractedContent?.overall_confidence ??
      extractedContent["Overall Confidence"];

    const formattedInvoice = {
      ...item,
      processing_status:
        item.processing_status === "COMPLETED"
          ? "Successful"
          : item.processing_status,
      updated_at: formatToReadableDate(item.updated_at),
      extracted_content: {
        ...extractedContent,
        overall_confidence: overallConfidence,
      },
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

export const processExtractedContent = (
  extractedContent: any,
  templateItems: { label: string }[]
) => {
  const regularFieldsData: RegularField[] = [];
  const itemsFieldsData: ItemField[] = [];

  const standardizedExtractionContent = standardizeInvoice(extractedContent);

  templateItems.forEach(({ label }) => {
    const value = standardizedExtractionContent[camelCase(label)];
    const confidence = extractedContent.confidence
      ? extractedContent?.confidence[label]
      : undefined;

    if (
      (label.toLowerCase().includes("item") ||
        label.toLowerCase().includes("description") ||
        label.toLowerCase().includes("material")) &&
      Array.isArray(value)
    ) {
      itemsFieldsData.push({ label, data: value, confidence });
    } else {
      let displayValue = formatExtractionValue(value);
      regularFieldsData.push({ field: label, value: displayValue, confidence });
    }
  });

  return {
    regularFieldsData,
    itemsFieldsData,
  };
};

export const extractJsonData = (invoices: any[], templateItems: any[]) => {
  return invoices.map((invoice) => {
    const { rawData, confidence, overallConfidence, ...filteredData } = invoice;

    const filteredResult = templateItems?.reduce<Record<string, any>>(
      (acc, { label }) => {
        const key = camelCase(label);
        if (filteredData[key]) {
          acc[key] = {
            value: filteredData[key],
            confidence: confidence ? confidence[label] : "N/A",
          };
        }
        return acc;
      },
      {}
    );

    return {
      ...filteredResult,
      overall_confidence: overallConfidence ?? "N/A",
    };
  });
};

export const extractCsvData = (invoices: any[], templateItems: any[]) => {
  return invoices.map((invoice) => {
    const { rawData, ...filteredData } = invoice;

    return templateItems?.reduce<Record<string, any>>((acc, { label }) => {
      const key = camelCase(label);
      if (filteredData[key]) {
        acc[key] = filteredData[key];
      }
      return acc;
    }, {});
  });
};
