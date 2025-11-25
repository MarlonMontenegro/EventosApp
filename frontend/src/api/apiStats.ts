import { apiRequest } from "./apiClient";

export async function fetchStatsOverview() {
  return apiRequest("/stats", {
    method: "GET",
  });
}
