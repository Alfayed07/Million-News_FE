import { proxyRequest } from "../../../_utils";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { id } = req.query;
    return proxyRequest(req, res, `/manage/news/${id}/archive`);
  }
  res.status(405).json({ message: "Method not allowed" });
}
