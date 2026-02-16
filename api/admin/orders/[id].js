import { connectDB } from '../../../api/_lib/db.js';
import { Order, logActivity } from '../../../api/_lib/models.js';
import { requireAuth } from '../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    if (method === 'DELETE') {
      const order = await Order.findByIdAndDelete(id);
      if (order) await logActivity(user.id, user.username, 'DELETE_ORDER', `Deleted order ${order.orderNumber}`);
      res.json({ message: 'Order deleted successfully' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error deleting order' });
  }
}
