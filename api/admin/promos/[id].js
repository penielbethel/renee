import { connectDB } from '../../../api/_lib/db.js';
import { Promo } from '../../../api/_lib/models.js';
import { requireAuth } from '../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    if (method === 'DELETE') {
      await Promo.findByIdAndDelete(id);
      res.json({ message: 'Promo deleted' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
