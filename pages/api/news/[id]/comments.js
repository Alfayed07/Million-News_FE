import { proxyRequest } from "../../_utils";
import api from "../../../../config/axios/axios";

function buildForwardHeaders(req) {
  const forwardHeaders = {};
  if (req.headers?.authorization) forwardHeaders["Authorization"] = req.headers.authorization;
  if (!forwardHeaders["Authorization"]) {
    let token = req.cookies?.token;
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
  return forwardHeaders;
}

export default async function handler(req, res) {
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ message: "missing id" });
  // Support redirect mode for SSR-friendly form posts
  const wantsRedirect = req.method === "POST" && ("redirect" in req.query);
  if (!wantsRedirect) {
    return proxyRequest(req, res, `/news/${encodeURIComponent(id)}/comments`);
  }

  try {
    const url = `/news/${encodeURIComponent(id)}/comments`;
    const headers = buildForwardHeaders(req);
    await api.post(url, req.body, { headers });
    // Redirect back to article page to re-render via SSR
    res.writeHead(303, { Location: `/berita/${encodeURIComponent(id)}` });
    res.end();
  } catch (e) {
    const status = e?.response?.status || 500;
    const data = e?.response?.data || { message: e.message };
    res.status(status).json(data);
  }
}
