import { connectDB } from '../_lib/db.js';
import { Order, Customer, Token, User, Promo, Coupon, logActivity } from '../_lib/models.js';
import { requireAuth } from '../_lib/auth.js';
import { applyCors } from '../_lib/cors.js';
import crypto from 'crypto';

export default async function handler(req, res) {
    if (applyCors(req, res)) return;

    const path = req.url.split('?')[0];
    const endpoint = path.split('/').pop();

    try {
        await connectDB();

        // 1. Analytics
        if (endpoint === 'analytics') {
            const user = requireAuth(req, res, ['admin', 'superadmin']);
            if (!user) return;
            if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });
            const now = new Date();
            const startOfWeek = new Date(now);
            startOfWeek.setDate(now.getDate() - now.getDay());
            startOfWeek.setHours(0, 0, 0, 0);
            const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            const startOfYear = new Date(now.getFullYear(), 0, 1);

            const weeklyOrders = await Order.find({ createdAt: { $gte: startOfWeek }, status: 'completed' });
            const monthlyOrders = await Order.find({ createdAt: { $gte: startOfMonth }, status: 'completed' });
            const yearlyOrders = await Order.find({ createdAt: { $gte: startOfYear }, status: 'completed' });
            const totalOrders = await Order.countDocuments({ status: 'completed' });
            const totalRevenueAgg = await Order.aggregate([
                { $match: { status: 'completed' } },
                { $group: { _id: null, total: { $sum: '$totalAmount' } } }
            ]);
            const totalCustomers = await Customer.countDocuments();
            const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

            return res.json({
                weekly: { orders: weeklyOrders.length, revenue: weeklyOrders.reduce((s, o) => s + o.totalAmount, 0) },
                monthly: { orders: monthlyOrders.length, revenue: monthlyOrders.reduce((s, o) => s + o.totalAmount, 0) },
                yearly: { orders: yearlyOrders.length, revenue: yearlyOrders.reduce((s, o) => s + o.totalAmount, 0) },
                total: { orders: totalOrders, revenue: totalRevenueAgg[0]?.total || 0, customers: totalCustomers },
                recentOrders
            });
        }

        // 2. Customers
        if (endpoint === 'customers') {
            const user = requireAuth(req, res, ['admin', 'superadmin']);
            if (!user) return;
            if (req.method === 'GET') {
                const { action, email } = req.query;
                if (action === 'orders' && email) {
                    return res.json(await Order.find({ customerEmail: email }).sort({ createdAt: -1 }));
                }
                return res.json(await Customer.find().sort({ totalSpent: -1 }));
            }
            if (req.method === 'DELETE') {
                const { id } = req.query;
                const customer = await Customer.findByIdAndDelete(id);
                if (customer) await logActivity(user.id, user.username, 'DELETE_CUSTOMER', `Deleted customer ${customer.email}`);
                return res.json({ message: 'Customer deleted successfully' });
            }
        }

        // 3. Orders
        if (endpoint === 'orders') {
            const user = requireAuth(req, res, ['admin', 'superadmin']);
            if (!user) return;
            if (req.method === 'GET') return res.json(await Order.find().sort({ createdAt: -1 }));
            if (req.method === 'DELETE') {
                const { id } = req.query;
                const order = await Order.findByIdAndDelete(id);
                if (order) await logActivity(user.id, user.username, 'DELETE_ORDER', `Deleted order ${order.orderNumber}`);
                return res.json({ message: 'Order deleted successfully' });
            }
        }

        // 4. Promos
        if (endpoint === 'promos') {
            const user = requireAuth(req, res, ['admin', 'superadmin']);
            if (!user) return;
            if (req.method === 'GET') return res.json(await Promo.find().sort({ createdAt: -1 }));
            if (req.method === 'POST') {
                const promo = await Promo.create({ ...(req.body || {}), createdBy: user.username });
                return res.status(201).json(promo);
            }
            if (req.method === 'PATCH') {
                const { id, action } = req.query;
                if (action === 'toggle') {
                    const promo = await Promo.findById(id);
                    if (!promo) return res.status(404).json({ message: 'Promo not found' });
                    promo.isActive = !promo.isActive;
                    await promo.save();
                    return res.json(promo);
                }
            }
            if (req.method === 'DELETE') {
                await Promo.findByIdAndDelete(req.query.id);
                return res.json({ message: 'Promo deleted' });
            }
        }

        // 5. Coupons
        if (endpoint === 'coupons') {
            const user = requireAuth(req, res, ['admin', 'superadmin']);
            if (!user) return;
            if (req.method === 'GET') return res.json(await Coupon.find().sort({ createdAt: -1 }));
            if (req.method === 'POST') {
                const coupon = await Coupon.create({ ...(req.body || {}), createdBy: user.username });
                await logActivity(user.id, user.username, 'CREATE_COUPON', `Created coupon ${coupon.code}`);
                return res.status(201).json(coupon);
            }
            if (req.method === 'PATCH') {
                const { id, action } = req.query;
                if (action === 'toggle') {
                    const coupon = await Coupon.findById(id);
                    if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
                    coupon.isActive = !coupon.isActive;
                    await coupon.save();
                    await logActivity(user.id, user.username, 'TOGGLE_COUPON', `Toggled coupon ${coupon.code} to ${coupon.isActive}`);
                    return res.json(coupon);
                }
            }
            if (req.method === 'DELETE') {
                const coupon = await Coupon.findByIdAndDelete(req.query.id);
                if (coupon) await logActivity(user.id, user.username, 'DELETE_COUPON', `Deleted coupon ${coupon.code}`);
                return res.json({ message: 'Coupon deleted' });
            }
        }

        // SuperAdmin Only Endpoints
        // 6. Tokens
        if (endpoint === 'tokens') {
            const user = requireAuth(req, res, ['superadmin']);
            if (!user) return;
            if (req.method === 'GET') return res.json(await Token.find().sort({ createdAt: -1 }));
            if (req.method === 'DELETE') {
                await Token.findByIdAndDelete(req.query.id);
                return res.json({ message: 'Token deleted' });
            }
        }

        // 7. Generate Token
        if (endpoint === 'generate-token') {
            const user = requireAuth(req, res, ['superadmin']);
            if (!user) return;
            if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });
            const expiresAt = new Date();
            expiresAt.setHours(expiresAt.getHours() + 24);
            for (let i = 0; i < 5; i++) {
                const code = crypto.randomBytes(6).toString('base64').replace(/[^A-Z0-9]/gi, '').substring(0, 8).toUpperCase();
                try {
                    const newToken = new Token({ code, expiresAt, used: false });
                    await newToken.save();
                    return res.json({ code });
                } catch (err) { if (err.code === 11000) continue; throw err; }
            }
            return res.status(500).json({ message: 'Could not generate unique token' });
        }

        // 8. Users
        if (endpoint === 'users') {
            const user = requireAuth(req, res, ['superadmin']);
            if (!user) return;
            if (req.method === 'GET') return res.json(await User.find({ role: 'admin' }).select('-password'));
            if (req.method === 'DELETE') {
                await User.findByIdAndDelete(req.query.id);
                return res.json({ message: 'Admin user deleted successfully' });
            }
        }

        return res.status(404).json({ message: 'Admin endpoint not found' });
    } catch (error) {
        console.error('Admin API error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
