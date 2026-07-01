import axios from "axios";

// In dev, VITE_API_URL is empty and requests hit "/api/..." which Vite
// proxies to the backend. In production, set VITE_API_URL to the deployed
// backend origin (e.g. https://tasker-api.onrender.com).
const baseURL = `${import.meta.env.VITE_API_URL || ""}/api`;

export const TOKEN_KEY = "tasker-token";

const api = axios.create({
  baseURL,
  headers: { "Content-Type": "application/json" },
});

// Attach the current token to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// On 401 (expired/invalid token) broadcast so the app can log the user out.
// Auth endpoints are exempt so a bad login shows an inline error instead.
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthCall = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthCall) {
      window.dispatchEvent(new Event("tasker:unauthorized"));
    }
    return Promise.reject(err);
  }
);

/** Normalize axios errors into a plain Error with a useful message. */
export const toError = (err) => {
  const data = err.response?.data;
  const message =
    (data?.errors && data.errors.join(", ")) ||
    data?.message ||
    err.message ||
    "Something went wrong";
  return new Error(message);
};

export default api;
