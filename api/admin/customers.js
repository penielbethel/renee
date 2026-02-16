import { connectDB } from '../_lib/db.js';
import { Customer, Order, logActivity } from '../_lib/models.js';
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
      const { action, email } = req.query;
      if (action === 'orders' && email) {
        const orders = await Order.find({ customerEmail: email }).sort({ createdAt: -1 });
        res.json(orders);
        return;
      }
      const customers = await Customer.find().sort({ totalSpent: -1 });
      res.json(customers);
      return;
    }
    if (method === 'DELETE') {
      const { id } = req.query;
      const customer = await Customer.findByIdAndDelete(id);
      if (customer) await logActivity(user.id, user.username, 'DELETE_CUSTOMER', `Deleted customer ${customer.email}`);
      res.json({ message: 'Customer deleted successfully' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
