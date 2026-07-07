import { authHeaders } from "./authHeaders";

const BASE_URL = "http://localhost:8080/api/resume-analyzer";

export async function getAllAnalyses() {
  const response = await fetch(BASE_URL, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch analysis history");
  return response.json();
}

export async function getAnalysisById(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to fetch analysis details");
  return response.json();
}

export async function analyzeResume(resumeText, jobDescription) {
  const response = await fetch(`${BASE_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify({ resumeText, jobDescription }),
  });
  if (!response.ok) throw new Error("Failed to analyze resume");
  return response.json();
}

export async function deleteAnalysis(id) {
  const response = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { ...authHeaders() },
  });
  if (!response.ok) throw new Error("Failed to delete analysis");
}
