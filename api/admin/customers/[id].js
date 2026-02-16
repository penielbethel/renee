import { connectDB } from '../../../api/_lib/db.js';
import { Customer, logActivity } from '../../../api/_lib/models.js';
import { requireAuth } from '../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;
  const method = req.method;
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    if (method === 'DELETE') {
      const customer = await Customer.findByIdAndDelete(id);
      if (customer) await logActivity(user.id, user.username, 'DELETE_CUSTOMER', `Deleted customer ${customer.email}`);
      res.json({ message: 'Customer deleted successfully' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error deleting customer' });
  }
}
