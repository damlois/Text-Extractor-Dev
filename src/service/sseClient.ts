export const manageSSE = (endpoint: string, onMessage: (data: any) => void) => {
  const BASE_URL = process.env.REACT_APP_DEV_API_URL || "";
  let eventSource: EventSource | null = null;

  const startSSE = () => {
    eventSource = new EventSource(`${BASE_URL}${endpoint}`);

    eventSource.onmessage = ({ data }: MessageEvent) => {
      const cleanedData = data
        .split("\n")
        .filter((line: string) => line.startsWith("data:"))
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
