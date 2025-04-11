export const routeConfig = [
  {
    key: "data-source",
    label: "Data Source Configuration",
    breadcrumbs: [
      { label: "Home", path: "/home" },
      { label: "Data Source Configuration" },
    ],
    nestedRoutes: [
      {
        key: "create",
        label: "Data Source Configuration",
        breadcrumbs: [
          { label: "Home", path: "/home" },
          { label: "Data Source Configuration" },
        ],
      },
      {
        key: "connect-email",
        label: "Email Data Source Configuration",
        breadcrumbs: [
          { label: "Home", path: "/home" },
          { label: "Data Source Configuration" },
        ],
      },
      {
        key: "field-extraction-setup",
        label: "Email Data Source Configuration",
        breadcrumbs: [
          { label: "Home", path: "/home" },
          { label: "Data Source Configuration" },
        ],
      },
    ],
  },
  {
    key: "extraction-history",
    label: "Extraction History",
    breadcrumbs: [
      { label: "Home", path: "/home" },
      {
        label: "Invoice Processing",
        path: "/home/invoice-processing/data-source",
      },
      { label: "Extraction History" },
    ],
    nestedRoutes: [
      {
        key: "duplicates",
        label: "Duplicate Invoices",
        breadcrumbs: [
          { label: "Home", path: "/home" },
          {
            label: "Invoice Processing",
            path: "/home/invoice-processing/data-source",
          },
          {
            label: "Extraction History",
            path: "/home/invoice-processing/extraction-history",
          },
          { label: "Duplicate Invoices" },
        ],
      },
      {
        key: "generate-insights",
        label: "Preview of Selected Extraction",
        breadcrumbs: [
          { label: "Home", path: "/home" },
          {
            label: "Invoice Processing",
            path: "/home/invoice-processing/data-source",
          },
          {
            label: "Extraction History",
            path: "/home/invoice-processing/extraction-history",
          },
          { label: "Preview & Generate Insight" },
        ],
      },
    ],
  },
  {
    key: "saved-insights",
    label: "Saved Insights",
    breadcrumbs: [
      { label: "Home", path: "/home" },
      {
        label: "Invoice Processing",
        path: "/home/invoice-processing/data-source",
      },
      { label: "Saved Insights" },
    ],
  },
];

// error messages
export const DEFAULT_ERROR_MESSAGE = "Something went wrong. Please try again.";
export const NETWORK_ERROR_MESSAGE =
  "Please check your internet connection and try again.";
export const TIMEOUT_ERROR_MESSAGE = "The request timed out. Please try again.";
export const AUTH_IFRAME_TIMEOUT_MESSAGE =
  "Session has expired. Please log in again.";
export const UNAUTHORIZED_MESSAGE =
  "You are unauthorized to perform this action. Please log in again.";
export const FORBIDDEN_MESSAGE =
  "You do not have permission to perform this action.";
