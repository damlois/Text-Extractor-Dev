// export interface ErrorNotificationConfig {
//   showNotification: (type: "success" | "error", message: string) => void;
//   defaultErrorMessage?: string;
// }

export interface BackendErrorResponse {
  detail?: string;
  error?: {
    code?: string;
    message?: string;
  };
}
