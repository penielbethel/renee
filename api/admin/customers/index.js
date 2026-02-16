import { connectDB } from '../../../api/_lib/db.js';
import { Customer } from '../../../api/_lib/models.js';
import { requireAuth } from '../../../api/_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    const customers = await Customer.find().sort({ totalSpent: -1 });
    res.json(customers);
  } catch (e) {
    res.status(500).json({ message: 'Server error fetching customers' });
  }
}
