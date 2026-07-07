const BASE_URL = "http://localhost:8080/api/auth";

export async function login(username, password) {
  const response = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Invalid username or password");
  }
  const data = await response.json();
  localStorage.setItem("token", data.token);
  localStorage.setItem("username", username);
  return data;
}

export async function register(username, password) {
  const response = await fetch(`${BASE_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!response.ok) {
    throw new Error("Registration failed — username may already be taken");
  }
  return response.json();
}

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("username");
}

export function getToken() {
  return localStorage.getItem("token");
}

export function getUsername() {
  return localStorage.getItem("username");
}

export function isLoggedIn() {
  return !!getToken();
}