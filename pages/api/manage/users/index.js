import { proxyRequest } from "../../_utils";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return proxyRequest(req, res, "/manage/users");
  }
  res.setHeader("Allow", ["GET"]);
  return res.status(405).json({ message: "Method not allowed" });
}
