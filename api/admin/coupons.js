import { connectDB } from '../_lib/db.js';
import { Coupon, logActivity } from '../_lib/models.js';
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
            const coupons = await Coupon.find().sort({ createdAt: -1 });
            return res.json(coupons);
        }

        if (method === 'POST') {
            const body = req.body || {};
            const coupon = await Coupon.create(body);
            await logActivity(user.id, user.username, 'CREATE_COUPON', `Created coupon ${coupon.code}`);
            return res.status(201).json(coupon);
        }

        if (method === 'PATCH') {
            const { id, action } = req.query;

            if (action === 'toggle') {
                const coupon = await Coupon.findById(id);
                if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
                coupon.isActive = !coupon.isActive;
                await coupon.save();
                return res.json(coupon);
            }

            const updatedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true });
            return res.json(updatedCoupon);
        }

        if (method === 'DELETE') {
            const { id } = req.query;
            await Coupon.findByIdAndDelete(id);
            await logActivity(user.id, user.username, 'DELETE_COUPON', `Deleted coupon ${id}`);
            return res.json({ message: 'Coupon deleted' });
        }

        return res.status(405).json({ message: 'Method Not Allowed' });
    } catch (e) {
        console.error('Coupon API error:', e);
        return res.status(500).json({ message: 'Server error' });
    }
}
