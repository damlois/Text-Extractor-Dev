const BASE_URL = process.env.REACT_APP_INVOICE_API_URL || "";

/**
 * Starts an SSE connection using EventSource.
 * @param {string} endpoint - API endpoint (e.g., "/invoices/processed-stream")
 * @param {(data: any) => void} onMessage - Callback function for handling SSE messages
 * @returns {Object} - Object with a `stop` method to close the connection.
 */
export const manageSSE = (endpoint: string, onMessage: (data: any) => void) => {
  const eventSource = new EventSource(`${BASE_URL}${endpoint}`);

  eventSource.onmessage = ({ data }: MessageEvent) => {
    const cleanedData = data
      .split("\n")
      .map((line: any) => line.replace(/^data:\s*/, "").trim())
      .filter((line: any) => line)
      .join("");

    if (!cleanedData || cleanedData === "[DONE]") {
      return;
    }

    try {
      const jsonData = JSON.parse(cleanedData);
      onMessage(jsonData);
    } catch (error) {
      console.error("Error parsing SSE data:", error);
    }
  };

  eventSource.onerror = () => {
    console.warn("SSE connection error. Closing Connection & Retrying...");
    eventSource.close();
    setTimeout(() => manageSSE(endpoint, onMessage), 2000);
  };

  return {
    stop: () => {
      console.log("Closing SSE connection.");
      eventSource.close();
    },
  };
};
