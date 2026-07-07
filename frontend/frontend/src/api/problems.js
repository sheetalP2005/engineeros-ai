import { authHeaders } from "./authHeaders";

const BASE_URL = "http://localhost:8080/api/problems";

export async function getAllProblems() {
  const response = await fetch(BASE_URL, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) {
    throw new Error("Failed to fetch problems");
  }
  return response.json();
}