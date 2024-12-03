import { notification } from "antd";

/**
 * Displays a notification.
 * @param type - The type of notification ('success', 'error', 'info', 'warning').
 * @param message - The title of the notification.
 * @param description - The body of the notification.
 */
export const showNotification = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  description?: string
): void => {
  notification[type]({
    message,
    description,
  });
};

/**
 * Formats an ISO date string into a human-readable format like "23 Nov 2024".
 *
 * @param isoDateString - The ISO 8601 date string to be formatted (e.g., "2024-11-19T13:27:33.066925").
 * @returns A formatted date string in the format "dd MMM yyyy" (e.g., "19 Nov 2024").
 */
export const formatDate = (isoDateString: string): string => {
  const date = new Date(isoDateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  return date.toLocaleDateString("en-GB", options);
};
