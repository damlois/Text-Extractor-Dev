import { User } from "../types";
import apiClient from "../service/apiClient";

export const fileProcessorApi = {
  getCurrentUser: () => apiClient.get<User>("/users/me"),
};
