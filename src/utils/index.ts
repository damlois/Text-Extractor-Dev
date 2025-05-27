import _ from "lodash";

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

export const formatExtractionValue = (value: any): string => {
  if (value === null || value === undefined) {
    return "N/A";
  }

  if (typeof value === "object") {
    // Case 1: Array of objects
    if (Array.isArray(value)) {
      const filtered = value.filter(
        (item) =>
          item !== null && typeof item === "object" && !Array.isArray(item)
      );

      if (filtered.length === 0) {
        // Fallback: array of primitives
        return value.join(", ");
      }

      return filtered
        .map(
          (obj, index) =>
            `{${index + 1}} ` +
            Object.entries(obj)
              .map(([key, val]) => `${key}: ${val ?? "N/A"}`)
              .join(", ")
        )
        .join(" | ");
    }

    // Case 2: Object with array values of same length
    const objectValues = Object.values(value);
    const allArrays = objectValues.every((v) => Array.isArray(v));
    const sameLength =
      allArrays &&
      objectValues.every(
        (v) =>
          Array.isArray(v) && v.length === (objectValues[0] as unknown[]).length
      );

    if (allArrays && sameLength) {
      const keys = Object.keys(value);
      const rows = value[keys[0]].map((_: any, i: string | number) =>
        keys.map((key) => `${key}: ${value[key][i] ?? "N/A"}`).join(", ")
      );

      return rows
        .map((row: any, idx: number) => `{${idx + 1}} ${row}`)
        .join(" | ");
    }

    // Case 3: Regular object
    return Object.entries(value)
      .map(([key, val]) => `${key}: ${val ?? "N/A"}`)
      .join(", ");
  }

  // Fallback: primitive value
  return value.toString();
};

export const areRecordsEqual = (
  obj1: Record<any, any>,
  obj2: Record<any, any>
) => {
  return _.isEqual(obj1, obj2);
};

export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  const formatter = new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
  return formatter.format(date);
};

export const capitalizeFirstLetter = (value?: string | null) => {
  return value
    ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : "";
};

export const capitalizeEveryWord = (value?: string | null): string => {
  return value
    ? value
        .toLowerCase()
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";
};
