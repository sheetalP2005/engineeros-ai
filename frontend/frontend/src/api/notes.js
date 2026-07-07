import { authHeaders } from "./authHeaders";

const BASE_URL = "http://localhost:8080/api/notes";

export async function getAllNotes() {
  const response = await fetch(BASE_URL, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch notes");
  return response.json();
}

export async function createNote(note) {
  const response = await fetch(BASE_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to create note");
  return response.json();
}

export async function updateNote(id, note) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(note),
  });
  if (!response.ok) throw new Error("Failed to update note");
  return response.json();
}

export async function deleteNote(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to delete note");
}