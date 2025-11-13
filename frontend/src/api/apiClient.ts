// src/api/apiClient.ts
import axios from "axios";

const API_BASE_URL = "https://incidenthub-kxjp.onrender.com";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("incidenthub_token");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
