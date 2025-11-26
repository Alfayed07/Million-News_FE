import formidable from 'formidable';
import fs from 'fs';

// Disable Next.js body parser so we can handle multipart ourselves
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    // Parse multipart form data
    const form = formidable({ multiples: false });
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        else resolve([fields, files]);
      });
    });

    const file = files.file?.[0] || files.file;
    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Get auth token from cookie
    const token = req.cookies?.token;
    if (!token) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Read file and create FormData for backend
    const fileBuffer = fs.readFileSync(file.filepath);
    const blob = new Blob([fileBuffer], { type: file.mimetype });
    const formData = new FormData();
    formData.append('file', blob, file.originalFilename || file.newFilename);

    // Forward to backend
    const origin = process.env.NEXT_PUBLIC_API_BASE_URL || process.env.API_BASE_URL || 'http://localhost:8070';
    const fetchRes = await fetch(origin + '/manage/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await fetchRes.json().catch(() => ({ message: 'Invalid JSON response' }));
    
    // Clean up temp file
    try {
      fs.unlinkSync(file.filepath);
    } catch {}

    return res.status(fetchRes.status).json(data);
  } catch (e) {
    console.error('Upload proxy error:', e);
    return res.status(500).json({ message: e.message });
  }
}