import { connectDB } from '../../../../api/_lib/db.js';
import { Order } from '../../../../api/_lib/models.js';
import { requireAuth } from '../../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const { email } = req.query;
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (e) {
    res.status(500).json({ message: 'Server error fetching customer orders' });
  }
}
