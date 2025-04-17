export const manageSSE = (endpoint: string, onMessage: (data: any) => void) => {
  const BASE_URL = process.env.REACT_APP_DEMO_API_URL || "";
  let eventSource: EventSource | null = null;
  let timeoutId: NodeJS.Timeout;

  const TIMEOUT_MS = 10000;

  const startSSE = () => {
    eventSource = new EventSource(`${BASE_URL}${endpoint}`);

    const handleTimeout = () => {
      console.warn("No data received from SSE within timeout window.");
      onMessage([]);
      eventSource?.close();
    };

    timeoutId = setTimeout(handleTimeout, TIMEOUT_MS);

    eventSource.onmessage = ({ data }: MessageEvent) => {
      clearTimeout(timeoutId);

      const cleanedData = data
        .split("\n")
        .filter((line: string) => line.startsWith("data:")) // Ignore ping lines
        .map((line: string) => line.replace(/^data:\s*/, "").trim())
        .filter(Boolean)
        .join("");

      if (!cleanedData || cleanedData === "[DONE]") {
        onMessage([]);
        return;
      }

      try {
        const jsonData = JSON.parse(cleanedData);
        const isEmptyObject =
          typeof jsonData === "object" &&
          jsonData !== null &&
          Object.keys(jsonData).length === 0;

        onMessage(isEmptyObject ? [] : jsonData);
      } catch (error) {
        console.error("Error parsing SSE data:", error);
        onMessage([]);
      }

      // Optionally restart timeout to close connection again if no new messages
      timeoutId = setTimeout(handleTimeout, TIMEOUT_MS);
    };

    eventSource.addEventListener("done", () => {
      clearTimeout(timeoutId);
      eventSource?.close();
    });

    eventSource.addEventListener("error", (event) => {
      console.error("Streaming error:", event);
      clearTimeout(timeoutId);
      eventSource?.close();
    });
  };

  startSSE();

  return {
    stop: () => {
      clearTimeout(timeoutId);
      eventSource?.close();
    },
  };
};
