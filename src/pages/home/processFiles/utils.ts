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
