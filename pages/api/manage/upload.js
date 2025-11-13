import { proxyRequest } from "../_utils";

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }
  // Forward multipart form-data directly (proxyRequest currently assumes JSON; we implement manual forward)
  try {
    const formHeaders = {};
    if (req.headers.authorization) formHeaders['Authorization'] = req.headers.authorization;
    // Map cookie token to Authorization if missing
    if (!formHeaders['Authorization'] && req.cookies?.token) {
      formHeaders['Authorization'] = `Bearer ${req.cookies.token}`;
    }
    const origin = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8070';
    const fetchRes = await fetch(origin + '/manage/upload', {
      method: 'POST',
      headers: formHeaders,
      body: req.body, // Node 18+ keeps raw body for form-data when using edge runtime; for full support consider formidable.
    });
    const data = await fetchRes.json().catch(()=>({ message:'invalid json'}));
    return res.status(fetchRes.status).json(data);
  } catch (e) {
    return res.status(500).json({ message: e.message });
  }
}