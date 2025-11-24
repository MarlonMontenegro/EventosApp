// frontend/src/api/eventsApi.ts
import { apiRequest } from "./apiClient";

export async function fetchEvents() {
  // Tu backend tiene GET /api/events -> { success, events: [...] }
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
  // Tu backend espera también createdBy en el body
  return apiRequest("/events", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
