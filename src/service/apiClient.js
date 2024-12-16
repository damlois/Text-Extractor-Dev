import axios from 'axios';
import keycloakService from './keycloakService';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = keycloakService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;    
  }
  return config;
});

export default apiClient;