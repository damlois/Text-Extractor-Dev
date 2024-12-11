export const extractKeyValuePairs = (inputObj: any) => {
  if (!inputObj || typeof inputObj !== "object") {
    throw new Error("Invalid input: inputObj must be a non-null object");
  }

  const result: { [key: string]: string }[] = [];

  Object.entries(inputObj).forEach(([docName, fields]) => {
    const transformed: { [key: string]: string } = {};

    for (const [key, details] of Object.entries(
      fields as {
        [key: string]: {
          value: string | string[];
          confidence: string;
          source: string;
        };
      }
    )) {
      if (Array.isArray(details.value)) {
        transformed[key] = details.value.join(", ");
      } else {
        transformed[key] = details.value;
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

const guid: string = generateGUID();
console.log(guid);
