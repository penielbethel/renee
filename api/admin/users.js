import { connectDB } from '../_lib/db.js';
import { User } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const user = requireAuth(req, res, ['superadmin']);
  if (!user) return;
  try {
    await connectDB();
    const users = await User.find({ role: 'admin' }).select('-password');
    res.json(users);
  } catch (e) {
    res.status(500).json({ message: 'Server error fetching users' });
  }
}
