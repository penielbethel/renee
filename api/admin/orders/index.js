import { connectDB } from '../../../api/_lib/db.js';
import { Order } from '../../../api/_lib/models.js';
import { requireAuth } from '../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const method = req.method;
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;

  try {
    await connectDB();
    if (method === 'GET') {
      const orders = await Order.find().sort({ createdAt: -1 });
      res.json(orders);
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
