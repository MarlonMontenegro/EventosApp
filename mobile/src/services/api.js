// mobile/src/services/api.js
const API_BASE_URL = "http://192.168.1.17:3000"; 
// 👆 IP de tu PC en la misma red + puerto del backend

// Obtener comentarios por evento
export async function fetchComments(eventId) {
  const res = await fetch(`${API_BASE_URL}/api/comments/${eventId}`);
  if (!res.ok) {
    throw new Error("Error al obtener comentarios");
  }
  return res.json();
}

// Obtener overview de estadísticas
export async function fetchStatsOverview() {
  const res = await fetch(`${API_BASE_URL}/api/stats/overview`);
  if (!res.ok) {
    throw new Error("Error al obtener estadísticas");
  }
  return res.json();
}
