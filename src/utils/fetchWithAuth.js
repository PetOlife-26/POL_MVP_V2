/**
 * fetchWithAuth — Utility for making authenticated API requests.
 * Automatically attaches the Bearer token from localStorage.
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

export default async function fetchWithAuth(endpoint, options = {}) {
  const token = localStorage.getItem("access_token");
  const headers = {
    ...(options.headers || {}),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Don't set Content-Type for FormData (browser sets it with boundary)
  if (!(options.body instanceof FormData) && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  const url = endpoint.startsWith("http") ? endpoint : `${API_BASE}${endpoint}`;

  const res = await fetch(url, { ...options, headers });

  // If 401, clear tokens (session expired)
  if (res.status === 401) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    // Redirect to login if not already there
    if (!window.location.pathname.includes("/login")) {
      window.location.href = "/login";
    }
  }

  return res;
}
