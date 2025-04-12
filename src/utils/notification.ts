import { notification } from "antd";
import axios, { AxiosError } from "axios";
import { NETWORK_ERROR_MESSAGE, TIMEOUT_ERROR_MESSAGE, DEFAULT_ERROR_MESSAGE, AUTH_IFRAME_TIMEOUT_MESSAGE, UNAUTHORIZED_MESSAGE, FORBIDDEN_MESSAGE } from "../apps/invoiceApp/constants/messages";

interface BackendErrorResponse {
  detail?: string;
  error?: {
    code?: string;
    message?: string;
  };
}

notification.config({ placement: "top" });

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

const handleAxiosError = (error: any, resource?: string): string => {
  if (error.code === "ERR_NETWORK") return NETWORK_ERROR_MESSAGE;
  if (error.code === "ECONNABORTED") return TIMEOUT_ERROR_MESSAGE;

  const backendError = (error as AxiosError<BackendErrorResponse>).response
    ?.data;

  return (
    backendError?.error?.message ||
    (backendError?.detail
      ? parseDetail(backendError.detail, resource || "Resource")
      : DEFAULT_ERROR_MESSAGE)
  );
};

const handleThirdPartyError = (error: any): string => {
  const errorMsg = (error as { error: string }).error;

  if (
    typeof errorMsg === "string" &&
    errorMsg.toLowerCase().includes("iframe") &&
    errorMsg.toLowerCase().includes("timeout")
  ) {
    return AUTH_IFRAME_TIMEOUT_MESSAGE;
  }

  return errorMsg || DEFAULT_ERROR_MESSAGE;
};

export const handleError = (error: any, resource?: string): string | null => {
  let message = DEFAULT_ERROR_MESSAGE;

  if (axios.isAxiosError(error)) {
    message = handleAxiosError(error, resource);
  } else if (typeof error === "object" && error !== null && "error" in error) {
    message = handleThirdPartyError(error);
  }

  showNotification("error", message);
  return message;
};

const parseDetail = (detail: string, resource: string): string => {
  const [code, message] = detail.trim().split(":");

  switch (code) {
    case "400":
      return message;
    case "401":
      return UNAUTHORIZED_MESSAGE;
    case "403":
      return FORBIDDEN_MESSAGE;
    case "404":
      return `${resource} does not exist.`;
    default:
      return message || detail;
  }
};
