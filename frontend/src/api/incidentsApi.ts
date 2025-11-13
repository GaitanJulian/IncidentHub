// src/api/incidentsApi.ts
import { apiClient } from "./apiClient";

export const getIncidents = async (filters?: {
  status?: string;
  serviceId?: string;
}) => {
  const response = await apiClient.get("/incidents", { params: filters });
  return response.data;
};

export const createIncident = async (data: {
  title: string;
  description: string;
  serviceId: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
}) => {
  const response = await apiClient.post("/incidents", data);
  return response.data;
};
