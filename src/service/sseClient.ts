export const manageSSE = (endpoint: string, onMessage: (data: any) => void) => {
  const BASE_URL = process.env.REACT_APP_INVOICE_API_URL || "";
  let isStopped = false;
  let retryTimeout: NodeJS.Timeout | null = null;

  const eventSource = new EventSource(`${BASE_URL}${endpoint}`);

  eventSource.onmessage = ({ data }: MessageEvent) => {
    const cleanedData = data
      .split("\n")
      .map((line: string) => line.replace(/^data:\s*/, "").trim())
      .filter((line: any) => line)
      .join("");

    if (cleanedData && cleanedData !== "[DONE]") {
      try {
        const jsonData = JSON.parse(cleanedData);
        onMessage(jsonData);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
      }
    }
  };

  eventSource.onerror = () => {
    console.warn("SSE connection error. Closing Connection & Retrying...");
    eventSource.close();

    if (!isStopped) {
      retryTimeout = setTimeout(() => manageSSE(endpoint, onMessage), 3000);
    }
  };

  return {
    stop: () => {
      isStopped = true;
      eventSource.close();

      if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
      }
    },
  };
};
