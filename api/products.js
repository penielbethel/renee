import { connectDB } from './_lib/db.js';
import { Product } from './_lib/models.js';
import { applyCors } from './_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: 1 });
    res.json(products);
  } catch (e) {
    res.status(500).json({ message: 'Server error fetching products' });
  }
}
