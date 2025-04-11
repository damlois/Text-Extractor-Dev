//permissions
export const PERMISSIONS = {
  ADD_USER: "ADD_USER",
  EDIT_USER: "EDIT_USER",
  VIEW_USER: "VIEW_USER",
  VIEW_ROLE: "VIEW_ROLE",
  ADD_ROLE: "ADD_ROLE",
  EDIT_ROLE: "EDIT_ROLE",
  ADD_DATASOURCE: "ADD_DATASOURCE",
  VIEW_DATASOURCE: "VIEW_DATASOURCE",
  EDIT_DATASOURCE: "EDIT_DATASOURCE",
  GENERATE_INSIGHT: "GENERATE_INSIGHT",
  VIEW_INSIGHTS: "VIEW_INSIGHTS",
  UPDATE_SAVED_INSIGHTS: "UPDATE_SAVED_INSIGHTS",
  ARCHIVE_DUPLICATE: "ARCHIVE_DUPLICATE",
  VIEW_DUPLICATE: "VIEW_DUPLICATE",
  VIEW_EXTRACTION_HISTORY: "VIEW_EXTRACTION_HISTORY",
};

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
