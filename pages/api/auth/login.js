import api from "../../../config/axios/axios";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).json({ message: "Method Not Allowed" });
  }
  try {
    const { data } = await api.post("/auth/login", req.body);

    // Expect { token, user, ... }
    const token = data?.token;
    if (token) {
      const isProd = process.env.NODE_ENV === "production";
      const maxAge = 60 * 60 * 24; // 1 day
      res.setHeader("Set-Cookie", `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge};${isProd ? " Secure;" : ""}`);
    }

    // Return the rest of the response (excluding token if you prefer)
    return res.status(200).json({ message: data?.message || "ok", user: data?.user, token });
  } catch (e) {
    const status = e?.response?.status || 500;
    const message = e?.response?.data?.message || e.message;
    return res.status(status).json({ message });
  }
}
