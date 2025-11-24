
import { apiRequest } from "./apiClient";

export async function getStatsOverview() {
  return apiRequest(`/stats/overview`);
}

// Obtener estadísticas por evento (si luego agregan esto)
export async function getStatsByEvent(eventId: string) {
  return apiRequest(`/stats/event/${eventId}`);
}

// Obtener top creadores / top usuarios
export async function getTopCreators() {
  return apiRequest(`/stats/top-creators`);
}

// Obtener conteo de eventos por mes
export async function getEventsByMonth() {
  return apiRequest(`/stats/events-by-month`);
}
