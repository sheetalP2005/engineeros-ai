import { authHeaders } from "./authHeaders";

const BASE_URL = "http://localhost:8080/api/attempts";

export async function getAllAttempts() {
  const response = await fetch(BASE_URL, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch attempts");
  }
  return response.json();
}

export async function recordAttempt(problemId, status, notes) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ problemId: String(problemId), status, notes }),
  });
  if (!response.ok) {
    throw new Error("Failed to record attempt");
  }
  return response.json();
}