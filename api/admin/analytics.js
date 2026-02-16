import { connectDB } from '../../api/_lib/db.js';
import { Order, Customer } from '../../api/_lib/models.js';
import { requireAuth } from '../../api/_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  const user = requireAuth(req, res, ['admin', 'superadmin']);
  if (!user) return;
  try {
    await connectDB();
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

    res.json({
      weekly: { orders: weeklyOrders.length, revenue: weeklyOrders.reduce((s, o) => s + o.totalAmount, 0) },
      monthly: { orders: monthlyOrders.length, revenue: monthlyOrders.reduce((s, o) => s + o.totalAmount, 0) },
      yearly: { orders: yearlyOrders.length, revenue: yearlyOrders.reduce((s, o) => s + o.totalAmount, 0) },
      total: { orders: totalOrders, revenue: totalRevenueAgg[0]?.total || 0, customers: totalCustomers },
      recentOrders
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching analytics' });
  }
}
