export const manageSSE = (endpoint: string, onMessage: (data: any) => void) => {
  const BASE_URL = process.env.REACT_APP_INVOICE_API_URL || "";
  let isStopped = false;
  let retryTimeout: NodeJS.Timeout | null = null;
  let eventSource: EventSource | null = null;

  const startSSE = () => {
    if (isStopped) return;
    eventSource = new EventSource(`${BASE_URL}${endpoint}`);

    eventSource.onmessage = ({ data }: MessageEvent) => {
      if (isStopped) {
        eventSource?.close();
        return;
      }

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
      if (isStopped) return;
      console.warn("SSE connection error. Closing Connection & Retrying...");
      eventSource?.close();

      retryTimeout = setTimeout(startSSE, 3000);
    };
  };
  startSSE();

  return {
    stop: () => {
      isStopped = true;
      if (eventSource) {
        eventSource.close();
      }
      if (retryTimeout) {
        clearTimeout(retryTimeout);
        retryTimeout = null;
      }
    },
  };
};
