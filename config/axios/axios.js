import axios from "axios";

// Base URL priority:
// 1) NEXT_PUBLIC_API_BASE_URL (works on client and server)
// 2) API_BASE_URL (server-side only)
// 3) default localhost for dev
const baseURL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  process.env.API_BASE_URL ||
  "http://localhost:8070";

const api = axios.create({
  baseURL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Basic error logging on the server to aid debugging
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (typeof window === "undefined") {
      // Avoid noisy logs in the browser
      console.error(
        "[API]",
        err?.config?.method?.toUpperCase(),
        err?.config?.url,
        "->",
        err?.response?.status || err.code,
        err?.response?.data || err.message
      );
    }
    return Promise.reject(err);
  }
);

export default api;
