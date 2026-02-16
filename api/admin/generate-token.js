import { connectDB } from '../_lib/db.js';
import { Token } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';
import crypto from 'crypto';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const user = requireAuth(req, res, ['superadmin']);
  if (!user) return;

  try {
    await connectDB();

    let code;
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    // Try up to 5 times to generate a unique code
    for (let i = 0; i < 5; i++) {
      code = crypto.randomBytes(6).toString('base64')
        .replace(/[^A-Z0-9]/gi, '')
        .substring(0, 8)
        .toUpperCase();

      try {
        const newToken = new Token({ code, expiresAt, used: false });
        await newToken.save();
        return res.json({ code });
      } catch (err) {
        if (err.code === 11000) continue; // Duplicate code, try again
        throw err;
      }
    }

    return res.status(500).json({ message: 'Could not generate unique token' });
  } catch (error) {
    console.error('Generate token error:', error);
    return res.status(500).json({ message: error.message || 'Server error generating token' });
  }
}
