import { connectDB } from '../_lib/db.js';
import { User } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  const user = requireAuth(req, res, ['superadmin']);
  if (!user) return;

  try {
    await connectDB();

    if (req.method === 'GET') {
      const users = await User.find({ role: 'admin' }).select('-password');
      return res.json(users);
    }

    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ message: 'User ID required' });

      const deletedUser = await User.findByIdAndDelete(id);
      if (!deletedUser) return res.status(404).json({ message: 'User not found' });

      return res.json({ message: 'Admin user deleted successfully' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    console.error('Users task error:', e);
    return res.status(500).json({ message: 'Server error managing users' });
  }
}
