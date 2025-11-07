import api from "../../config/axios/axios";

// Simple proxy helper to call backend with same method/path and pass through body/query.
export async function proxyRequest(req, res, targetPath) {
  try {
    const method = req.method?.toLowerCase() || "get";
    const url = targetPath.startsWith("/") ? targetPath : `/${targetPath}`;

    // Forward selected headers (e.g., Authorization) and query params
    const forwardHeaders = {};
    if (req.headers?.authorization) forwardHeaders["Authorization"] = req.headers.authorization;
    // If no Authorization header, try to map token cookie to Bearer Authorization
    if (!forwardHeaders["Authorization"]) {
      // Prefer parsed cookies if available
      let token = req.cookies?.token;
      // Fallback to parsing raw cookie header (SSR fetch path)
      if (!token && req.headers?.cookie) {
        const raw = req.headers.cookie;
        const parts = raw.split(";");
        for (const part of parts) {
          const [k, v] = part.split("=");
          if (!k) continue;
          if (decodeURIComponent(k.trim()) === "token") {
            token = decodeURIComponent((v || "").trim());
            break;
          }
        }
      }
      if (token) forwardHeaders["Authorization"] = `Bearer ${token}`;
    }
    if (req.headers["x-access-token"]) forwardHeaders["x-access-token"] = req.headers["x-access-token"];

    const config = {
      params: req.query,
      headers: forwardHeaders,
    };

    let response;
    if (method === "get" || method === "delete") {
      // axios.get/delete signature: (url, config)
      response = await api[method](url, config);
    } else {
      // axios.post/put/patch signature: (url, data, config)
      response = await api[method](url, req.body, config);
    }

    const { data, status } = response;
    res.status(status || 200).json(data);
  } catch (e) {
    const status = e?.response?.status || 500;
    const data = e?.response?.data || { message: e.message };
    res.status(status).json(data);
  }
}
