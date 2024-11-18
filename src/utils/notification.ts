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
