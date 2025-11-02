import { proxyRequest } from "../_utils";

export default async function handler(req, res) {
  // Example: forward to /auth endpoint on the backend
  // Adjust target path as needed (e.g., /auth/login, /auth/refresh)
  return proxyRequest(req, res, "/auth");
}
