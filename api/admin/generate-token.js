import { connectDB } from '../_lib/db.js';
import { Token } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const user = requireAuth(req, res, ['superadmin']);
  if (!user) return;
  try {
    await connectDB();
    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);
    const newToken = new Token({ code, expiresAt, used: false });
    await newToken.save();
    res.json({ code });
  } catch (e) {
    res.status(500).json({ message: 'Server error generating token' });
  }
}
