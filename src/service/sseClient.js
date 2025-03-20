import { showNotification } from "../utils/notification";
import keycloakService from "./keycloakService";

const BASE_URL = process.env.REACT_APP_INVOICE_API_URL || "";

/**
 * Starts an SSE connection with authentication.
 * @param {string} endpoint - API endpoint (e.g., "/invoices/processed-stream")
 * @param {(data: any) => void} onMessage - Callback function for handling SSE messages
 * @param {number} [retryInterval=3000] - Time in milliseconds to retry on failure
 */
export const manageSSE = (endpoint, onMessage, retryInterval = 3000) => {
  const token = keycloakService.getToken();
  if (!token) {
    return;
  }

  const url = `${BASE_URL}${endpoint}`;

  let isCancelled = false;
  let messageBuffer = "";

  const connectSSE = async () => {
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "text/event-stream",
        },
      });

      if (!response.ok)
        showNotification(
          "error",
          "Something went wrong. please check your internet connection and try again"
        );

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value, done } = await reader.read();
        if (done || isCancelled) break;

        let chunk = decoder.decode(value, { stream: true }).trim();
        if (!chunk) continue;

        chunk = chunk
          .replace(/^data: /gm, "")
          .replace(/\[DONE\]/g, "")
          .trim();
        if (!chunk) continue;

        messageBuffer += chunk;

        try {
          const jsonMatch = messageBuffer.match(/\{[\s\S]*\}/);

          if (jsonMatch) {
            const cleanedJsonString = jsonMatch[0];
            const jsonData = JSON.parse(cleanedJsonString);

            onMessage(jsonData);
            messageBuffer = "";
          }
        } catch (error) {}
      }

      if (!isCancelled) {
        setTimeout(connectSSE, retryInterval);
      }
    } catch (error) {
      if (!isCancelled) {
        setTimeout(connectSSE, retryInterval);
      }
    }
  };

  connectSSE();

  return {
    stop: () => {
      isCancelled = true;
    },
  };
};
