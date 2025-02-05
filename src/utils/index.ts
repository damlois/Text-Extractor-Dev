interface ExtractionResult {
  [key: string]: string | null;
}

interface InputObject {
  [docName: string]: {
    [field: string]:
      | Array<{ value: string; confidence: string; source: string }>
      | { value: string; confidence: string; source: string };
  };
}

export const extractKeyValuePairs = (
  inputObj: InputObject
): ExtractionResult[] => {
  if (!inputObj || typeof inputObj !== "object") {
    throw new Error("Invalid input: inputObj must be a non-null object");
  }

  const result: ExtractionResult[] = [];

  Object.entries(inputObj).forEach(([docName, fields]) => {
    const transformed: ExtractionResult = { "Document Name": docName };

    for (const [key, details] of Object.entries(fields)) {
      if (key === "documentName") {
        continue;
      }

      if (Array.isArray(details)) {
        transformed[key] = details
          .map((detail) => detail?.value)
          .filter(Boolean)
          .join(", ");
      } else if (details && typeof details === "object" && "value" in details) {
        transformed[key] = Array.isArray(details.value)
          ? details.value.join(", ")
          : details.value;
      } else if (details && typeof details === "object") {
        transformed[key] = Object.values(details).join(", ");
      } else {
        transformed[key] = details;
      }
    }

    result.push(transformed);
  });

  return result;
};

export const base64ToBlob = (
  base64: string,
  mimeType: string = "image/jpeg"
) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array<number>(byteCharacters.length)
    .fill(0)
    .map((_, i) => byteCharacters.charCodeAt(i));
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimeType });
};

export const downloadImageFromBlobUrl = (
  imageUrl: string,
  filename: string = "downloaded-image.jpg"
) => {
  const link: HTMLAnchorElement = document.createElement("a");
  link.href = imageUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(imageUrl);
};

export const generateGUID = () => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
    /[xy]/g,
    (char: string): string => {
      const random: number = (Math.random() * 16) | 0;
      const value: number = char === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
    }
  );
};

export const requiredRule = (field: string) => ({
  required: true,
  message: `${field} is required`,
});

export const constructTableColumns = (result: any) => {
  if (result.length === 0) return [];

  const flattenObject = (obj: any, prefix = "") => {
    return Object.keys(obj).reduce((acc: any, key: string) => {
      const value = obj[key];
      const newKey = prefix ? `${prefix}_${key}` : key;

      if (value && typeof value === "object" && !Array.isArray(value)) {
        Object.assign(acc, flattenObject(value, newKey));
      } else {
        acc[newKey] = value;
      }

      return acc;
    }, {});
  };

  // Get the first result with invoice_data flattened
  const firstResult = result[0];
  const flattenedInvoiceData = firstResult.invoice_data
    ? flattenObject(firstResult.invoice_data)
    : {};

  // Combine base fields with flattened invoice data fields
  const baseColumns = [
    {
      title: "#",
      key: "index",
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: "File Name",
      dataIndex: "file_name",
      key: "file_name",
    },
    {
      title: "Status",
      dataIndex: "processing_status",
      key: "processing_status",
    },
    {
      title: "Date Created",
      dataIndex: "created_at",
      key: "created_at",
    },
  ];

  const invoiceDataColumns = Object.keys(flattenedInvoiceData).map((key) => ({
    title: key
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" "),
    dataIndex: ["invoice_data", ...key.split("_")],
    key,
  }));

  return [...baseColumns, ...invoiceDataColumns];
};

export const formatExtractionValue = (value: any) => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (typeof value === "object") {
    if (Array.isArray(value)) {
      // Handle arrays
      return value.length > 0 ? value.join(", ") : "N/A";
    } else {
      // Handle objects
      return Object.entries(value)
        .map(([key, val]) => `${key}: ${val ?? "N/A"}`) // Handle nested null/undefined values
        .join(", ");
    }
  }

  return value.toString();
};

