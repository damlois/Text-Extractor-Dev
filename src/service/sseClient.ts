export const manageSSE = (endpoint: string, onMessage: (data: any) => void) => {
  const BASE_URL = process.env.REACT_APP_INVOICE_API_URL || "";
  let eventSource: EventSource | null = null;

  const startSSE = () => {
    eventSource = new EventSource(`${BASE_URL}${endpoint}`);

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

    eventSource.addEventListener("done", () => {
      eventSource?.close();
    });

    eventSource.addEventListener("error", (event) => {
      console.error("Streaming error:", event);
      eventSource?.close();
    });
  };
  
  startSSE();

  return {
    stop: () => {
      eventSource?.close();
    },
  };
};
