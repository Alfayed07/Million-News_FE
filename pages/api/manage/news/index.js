import { proxyRequest } from "../../_utils";

export default async function handler(req, res) {
  // POST /api/manage/news -> /manage/news (create draft)
  if (req.method === "POST") {
    return proxyRequest(req, res, "/manage/news");
  }
  res.status(405).json({ message: "Method not allowed" });
}
