import axios from "axios";
import keycloakService from "./keycloakService";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_INVOICE_API_URL,
  timeout: 30000
});

apiClient.interceptors.request.use((config) => {
  const token = keycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
