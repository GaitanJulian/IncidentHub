import { apiClient } from "./apiClient";

export const getServices = async () => {
  const response = await apiClient.get("/services");
  return response.data;
};
