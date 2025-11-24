// frontend/src/api/apiClient.ts
import { auth } from "../firebase/firebaseConfig";

const API_URL = "http://192.168.0.19:3000/api"; // IP de tu PC + puerto del backend

async function getIdToken(): Promise<string | null> {
  const user = auth.currentUser;
  if (!user) return null;
  return await user.getIdToken();
}

export async function apiRequest(
  path: string,
  options: RequestInit = {}
): Promise<any> {
  const token = await getIdToken();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const url = `${API_URL}${path}`;
  console.log("🌐 API request:", url, "token?", !!token);

  let res: Response;

  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (error) {
    console.log("🔴 Network error en fetch:", error);
    throw new Error("No se pudo conectar con el servidor");
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    // por si viene vacío el body (204, etc.)
  }

  if (!res.ok) {
    const message = data?.error || data?.message || "Error en la petición";
    console.log("🔴 API error status:", res.status, message);
    throw new Error(message);
  }

  console.log("🟢 API OK:", data);
  return data;
}
