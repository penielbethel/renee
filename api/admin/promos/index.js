import { connectDB } from '../../../api/_lib/db.js';
import { Promo } from '../../../api/_lib/models.js';
import { requireAuth } from '../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const method = req.method;
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    if (method === 'GET') {
      const promos = await Promo.find().sort({ createdAt: -1 });
      res.json(promos);
      return;
    }
    if (method === 'POST') {
      const body = req.body || {};
      const promo = await Promo.create({ ...body, createdBy: user.username });
      res.status(201).json(promo);
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
