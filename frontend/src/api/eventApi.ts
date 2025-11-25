// frontend/src/api/eventsApi.ts
import { apiRequest } from "./apiClient";

export async function fetchEvents() {
  return apiRequest("/events", {
    method: "GET",
  });
}

export async function createEventApi(payload: {
  title: string;
  description?: string;
  type?: string;
  subtype?: string;
  date: string;
  location?: string;
  createdBy: string;
}) {
  return apiRequest("/events/create", {
    // 👈 CAMBIO AQUÍ
    method: "POST",
    body: JSON.stringify(payload),
  });
}
