import { connectDB } from '../_lib/db.js';
import { Promo } from '../_lib/models.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    try {
      await connectDB();
      const promos = await Promo.find({ isActive: true }).sort({ createdAt: -1 });
      res.json(promos);
    } catch (e) {
      res.json([]);
    }
  } catch (e) {
    res.status(500).json({ message: 'Server error fetching promos' });
  }
}
