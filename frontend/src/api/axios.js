import axios from "axios";
import keycloak from "../auth/keycloak";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 seconds before giving up
});

// ── Request interceptor — attach fresh JWT to every request ──
api.interceptors.request.use(
  async (config) => {
    if (keycloak.authenticated) {
      try {
        // Refreshes the token if it expires in less than 30 seconds
        await keycloak.updateToken(30);
        config.headers.Authorization = `Bearer ${keycloak.token}`;
      } catch {
        // Token refresh failed — session expired
        keycloak.login();
      }
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor — unwrap ApiResponse or surface the error message ──
api.interceptors.response.use(
  (response) => {
    // Our backend always returns: { status, message, data }
    // We return the whole ApiResponse so callers can access .data and .message
    return response.data;
  },
  (error) => {
    // Pull the backend's message out if available, otherwise use a fallback
    const message =
      error.response?.data?.message ||
      error.message ||
      "Something went wrong. Please try again.";

    return Promise.reject(new Error(message));
  },
);

export default api;
