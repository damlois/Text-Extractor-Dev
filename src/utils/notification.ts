import { notification } from "antd";
import axios, { AxiosError } from "axios";
import { BackendErrorResponse } from "./notificationTypes.";

notification.config({
  placement: "top",
});

export const showNotification = (
  type: "success" | "error" | "info" | "warning",
  message: string,
  description?: string,
  duration?: number
): void => {
  notification[type]({
    message,
    description,
    duration,
    className: "custom-notification",
  });
};

export const handleError = (error: any, resource?: string): string | null => {
  const defaultMessage = "Something went wrong. Please try again.";
  let message = defaultMessage;

  if (axios.isAxiosError(error)) {
    const backendError = (error as AxiosError<BackendErrorResponse>).response
      ?.data;

    message =
      backendError?.error?.message ||
      (backendError?.detail
        ? parseDetail(backendError.detail, resource || "Resource")
        : defaultMessage);
  }

  showNotification("error", message);
  return message;
};

const parseDetail = (detail: string, resource: string): string => {
  const trimmedDetail = detail.trim();
  const [code, message] = trimmedDetail.split(":");

  switch (code) {
    case "400":
      return "Validation error";
    case "409":
      return `${resource} already exists`;
    case "401":
      return "You are unauthorized to perform this action. Please log in again.";
    case "403":
      return "You do not have permission to perform this action.";
    case "404":
      return `${resource} does not exist.`;
    default:
      return message || trimmedDetail;
  }
};
