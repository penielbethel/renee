import { connectDB } from '../_lib/db.js';
import { Token } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  const method = req.method;
  const user = requireAuth(req, res, ['superadmin']);
  if (!user) return;
  try {
    await connectDB();
    if (method === 'GET') {
      const tokens = await Token.find().sort({ createdAt: -1 });
      res.json(tokens);
      return;
    }
    if (method === 'DELETE') {
      const { id } = req.query;
      const deletedToken = await Token.findByIdAndDelete(id);
      if (!deletedToken) {
        res.status(404).json({ message: 'Token not found in database' });
        return;
      }
      res.json({ message: 'Token deleted' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error on tokens endpoint' });
  }
}
