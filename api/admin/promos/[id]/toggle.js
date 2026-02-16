import { connectDB } from '../../../../api/_lib/db.js';
import { Promo } from '../../../../api/_lib/models.js';
import { requireAuth } from '../../../../api/_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query;
  if (req.method !== 'PATCH') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
    const promo = await Promo.findById(id);
    if (!promo) {
      res.status(404).json({ message: 'Promo not found' });
      return;
    }
    promo.isActive = !promo.isActive;
    await promo.save();
    res.json(promo);
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
