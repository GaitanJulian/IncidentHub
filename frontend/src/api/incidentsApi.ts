// src/api/incidentsApi.ts
import { apiClient } from "./apiClient";

export const getIncidents = async (filters?: {
  status?: string;
  serviceId?: string;
}) => {
  const response = await apiClient.get("/incidents", { params: filters });
  return response.data;
};

export const getIncidentById = async (id: string) => {
  const response = await apiClient.get(`/incidents/${id}`);
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

export const addIncidentComment = async (params: {
  id: string;
  content: string;
}) => {
  const response = await apiClient.post(`/incidents/${params.id}/comment`, {
    content: params.content,
  });
  return response.data;
};

export const updateIncidentStatus = async (params: {
  id: string;
  status: "OPEN" | "INVESTIGATING" | "RESOLVED";
}) => {
  const response = await apiClient.put(`/incidents/${params.id}/status`, {
    status: params.status,
  });
  return response.data;
};
