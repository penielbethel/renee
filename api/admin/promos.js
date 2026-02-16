import { connectDB } from '../_lib/db.js';
import { Promo } from '../_lib/models.js';
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
    if (method === 'PATCH') {
      const { id, action } = req.query;
      if (action === 'toggle') {
        const promo = await Promo.findById(id);
        if (!promo) {
          res.status(404).json({ message: 'Promo not found' });
          return;
        }
        promo.isActive = !promo.isActive;
        await promo.save();
        res.json(promo);
        return;
      }
      res.status(400).json({ message: 'Invalid action' });
      return;
    }
    if (method === 'DELETE') {
      const { id } = req.query;
      await Promo.findByIdAndDelete(id);
      res.json({ message: 'Promo deleted' });
      return;
    }
    res.status(405).json({ message: 'Method Not Allowed' });
  } catch (e) {
    res.status(500).json({ message: 'Server error' });
  }
}
