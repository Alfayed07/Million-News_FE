import api from "../../../config/axios/axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { data } = await api.post("/auth/reset-password", req.body);
    return res.status(200).json(data || { message: "ok" });
  } catch (e) {
    const status = e?.response?.status || 500;
    const message = e?.response?.data?.message || e.message;
    return res.status(status).json({ message });
  }
}
