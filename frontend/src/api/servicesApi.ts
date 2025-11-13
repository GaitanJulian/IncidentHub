import { apiClient } from "./apiClient";

export const getServices = async () => {
  const response = await apiClient.get("/services");
  return response.data;
};

export const createService = async (data: {
  name: string;
  description?: string;
}) => {
  const response = await apiClient.post("/services", data);
  return response.data;
};