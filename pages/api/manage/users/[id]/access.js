import { proxyRequest } from "../../../_utils";

export default async function handler(req, res) {
  if (req.method === "PUT") {
    const { id } = req.query;
    return proxyRequest(req, res, `/manage/users/${id}/access`);
  }
  res.setHeader("Allow", ["PUT"]);
  return res.status(405).json({ message: "Method not allowed" });
}
