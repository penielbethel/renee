import { connectDB } from '../_lib/db.js';
import { Order, logActivity } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
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
    if (method === 'DELETE') {
      const { id } = req.query;
      const order = await Order.findByIdAndDelete(id);
      if (order) await logActivity(user.id, user.username, 'DELETE_ORDER', `Deleted order ${order.orderNumber}`);
      res.json({ message: 'Order deleted successfully' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
