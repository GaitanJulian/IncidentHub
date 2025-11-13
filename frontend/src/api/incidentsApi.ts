import { apiClient } from "./apiClient";

export const getIncidents = async (filters?: {
  status?: string;
  serviceId?: string;
}) => {
  const response = await apiClient.get("/incidents", { params: filters });
  return response.data;
};
