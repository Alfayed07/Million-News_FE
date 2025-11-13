import { proxyRequest } from "../_utils";
export default async function handler(req, res) {
  if (req.method === "GET") {
    return proxyRequest(req, res, `/news/${req.query.id}`);
  }
  res.status(405).json({ message: "Method not allowed" });
}
