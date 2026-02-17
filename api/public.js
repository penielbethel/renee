import { connectDB } from './_lib/db.js';
import { Product, Promo } from './_lib/models.js';
import { applyCors } from './_lib/cors.js';
import { STATIC_PRODUCTS } from './_lib/static-products.js';

export default async function handler(req, res) {
    if (applyCors(req, res)) return;

    const path = req.url.split('?')[0];
    const endpoint = path.split('/').pop();

    try {
        await connectDB();

        if (endpoint === 'products') {
            try {
                const products = await Product.find().sort({ createdAt: 1 });
                return res.json(products);
            } catch (e) {
                return res.json(STATIC_PRODUCTS);
            }
        }

        if (endpoint === 'active') {
            try {
                const promos = await Promo.find({ isActive: true }).sort({ createdAt: -1 });
                return res.json(promos);
            } catch (e) {
                return res.json([]);
            }
        }

        return res.status(404).json({ message: 'Public endpoint not found' });
    } catch (error) {
        console.error('Public API error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
