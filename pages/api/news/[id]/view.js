import { proxyRequest } from "../../_utils";

export default async function handler(req, res) {
  const { id } = req.query || {};
  if (!id) return res.status(400).json({ message: "missing id" });
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  return proxyRequest(req, res, `/news/${encodeURIComponent(id)}/view`);
}
