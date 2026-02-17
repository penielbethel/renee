import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { connectDB } from '../_api_lib/db.js';
import { User, Token, logActivity, Order, Customer, Promo, Coupon, Product, ActivityLog, BlogPost } from '../_api_lib/models.js';
import { applyCors } from '../_api_lib/cors.js';
import { requireAuth } from '../_api_lib/auth.js';
import { STATIC_PRODUCTS } from '../_api_lib/static-products.js';

export default async function handler(req, res) {
    if (applyCors(req, res)) return;

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathParts = url.pathname.split('/').filter(p => p);

    // Basic routing: /api/xxx/yyy
    // pathParts will be something like ["api", "auth", "login"] or ["api", "products"]
    const section = pathParts[1]; // 'auth', 'admin', 'products', 'promos'
    const endpoint = pathParts[2]; // 'login', 'analytics', 'active', etc.

    try {
        await connectDB();

        // --- PUBLIC ENDPOINTS ---
        if (!section || section === 'products') {
            try {
                const products = await Product.find().sort({ createdAt: 1 });
                return res.json(products);
            } catch (e) {
                return res.json(STATIC_PRODUCTS);
            }
        }

        if (section === 'promos' && endpoint === 'active') {
            try {
                const promos = await Promo.find({ isActive: true }).sort({ createdAt: -1 });
                return res.json(promos);
            } catch (e) {
                return res.json([]);
            }
        }

        if (section === 'orders' && req.method === 'POST') {
            const data = req.body || {};
            const order = await Order.create(data);

            // Update customer record
            try {
                await Customer.findOneAndUpdate(
                    { email: data.customerEmail },
                    {
                        $inc: { totalOrders: 1, totalSpent: data.totalAmount },
                        $set: { lastOrderDate: new Date(), name: data.customerName, phone: data.customerPhone }
                    },
                    { upsert: true, new: true }
                );
            } catch (ce) { console.error("Customer update error:", ce); }

            return res.status(201).json(order);
        }

        if (section === 'coupons' && endpoint === 'validate' && req.method === 'POST') {
            const { code, email, productIds } = req.body || {};
            if (!code) return res.status(400).json({ valid: false, message: 'Coupon code required' });

            const coupon = await Coupon.findOne({ code, isActive: true });
            if (!coupon) return res.status(200).json({ valid: false, message: 'Invalid or inactive coupon' });

            const now = new Date();
            if (now < coupon.startDate || now > coupon.endDate) {
                return res.status(200).json({ valid: false, message: 'Coupon has expired or is not yet active' });
            }

            if (coupon.usedBy && coupon.usedBy.includes(email)) {
                return res.status(200).json({ valid: false, message: 'You have already used this coupon' });
            }

            if (coupon.usedBy && coupon.usageLimit > 0 && coupon.usedBy.length >= coupon.usageLimit) {
                return res.status(200).json({ valid: false, message: 'Coupon usage limit reached' });
            }

            // check applicable products
            let applicable = coupon.applicableProducts || [];
            if (productIds && productIds.length > 0 && applicable.length > 0) {
                const hasMatch = productIds.some(id => applicable.includes(id));
                if (!hasMatch) {
                    return res.status(200).json({ valid: false, message: 'Coupon not applicable to items in cart' });
                }
            }

            return res.json({
                valid: true,
                discountPercent: coupon.discountPercent,
                applicableProducts: coupon.applicableProducts,
                message: `Coupon applied! ${coupon.discountPercent}% discount.`
            });
        }

        // --- AUTH ENDPOINTS ---
        if (section === 'auth') {
            if (endpoint === 'login' && req.method === 'POST') {
                const { username, password } = req.body || {};
                if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
                const user = await User.findOne({ username, role: 'admin' });
                if (!user) return res.status(401).json({ message: 'Invalid credentials' });
                const match = await bcrypt.compare(password, user.password || '');
                if (!match) return res.status(401).json({ message: 'Invalid credentials' });
                const token = jwt.sign({ id: user._id, username: user.username, role: 'admin' }, process.env.JWT_SECRET);
                await logActivity(user._id, user.username, 'LOGIN', 'Admin logged in');
                return res.json({ token, user: { username: user.username, fullName: user.fullName || user.username, role: 'admin' } });
            }

            if (endpoint === 'register-admin' && req.method === 'POST') {
                const { username, fullName, password, tokenCode } = req.body || {};
                const tokenDoc = await Token.findOne({ code: tokenCode, used: false });
                if (!tokenDoc) return res.status(400).json({ message: 'Invalid or already used registration token' });
                if (new Date() > tokenDoc.expiresAt) return res.status(400).json({ message: 'Registration token has expired' });
                const existingUser = await User.findOne({ username });
                if (existingUser) return res.status(400).json({ message: 'Username already exists' });
                const hashedPassword = await bcrypt.hash(password, 10);
                const newUser = new User({ username, fullName, password: hashedPassword, role: 'admin' });
                await newUser.save();
                tokenDoc.used = true;
                await tokenDoc.save();
                return res.status(201).json({ message: 'Admin registered successfully' });
            }

            if (endpoint === 'super-login' && req.method === 'POST') {
                const { username } = req.body || {};
                const superAdmins = ['pbmsrvr', 'techadvantage'];
                if (!username || !superAdmins.includes(username)) return res.status(401).json({ message: 'Invalid SuperAdmin username' });
                const superAdminNames = {
                    'pbmsrvr': 'YINKA MICHAEL',
                    'techadvantage': 'ANTHONY APEJI'
                };
                let user = await User.findOne({ username });
                const fullName = superAdminNames[username];

                if (!user) {
                    user = new User({ username, fullName, role: 'superadmin' });
                    await user.save();
                } else {
                    // Update role and name if needed
                    user.role = 'superadmin';
                    user.fullName = fullName;
                    await user.save();
                }
                const token = jwt.sign({ id: user._id, username: user.username, role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
                await logActivity(user._id, user.username, 'LOGIN', 'SuperAdmin logged in');
                return res.json({ token, user: { username: user.username, fullName: user.fullName, role: 'superadmin' } });
            }
        }

        // --- ADMIN ENDPOINTS (Protected) ---
        if (section === 'admin') {
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
                    const resourceId = req.query.id || pathParts[3];
                    const customer = await Customer.findByIdAndDelete(resourceId);
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
                    const resourceId = req.query.id || pathParts[3];
                    const order = await Order.findByIdAndDelete(resourceId);
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
                    const resourceId = req.query.id || pathParts[3];
                    const action = req.query.action;
                    if (action === 'toggle') {
                        const promo = await Promo.findById(resourceId);
                        if (!promo) return res.status(404).json({ message: 'Promo not found' });
                        promo.isActive = !promo.isActive;
                        await promo.save();
                        return res.json(promo);
                    }
                }
                if (req.method === 'DELETE') {
                    const resourceId = req.query.id || pathParts[3];
                    await Promo.findByIdAndDelete(resourceId);
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
                    const resourceId = req.query.id || pathParts[3];
                    const action = req.query.action;
                    if (action === 'toggle') {
                        const coupon = await Coupon.findById(resourceId);
                        if (!coupon) return res.status(404).json({ message: 'Coupon not found' });
                        coupon.isActive = !coupon.isActive;
                        await coupon.save();
                        await logActivity(user.id, user.username, 'TOGGLE_COUPON', `Toggled coupon ${coupon.code} to ${coupon.isActive}`);
                        return res.json(coupon);
                    }
                }
                if (req.method === 'DELETE') {
                    const resourceId = req.query.id || pathParts[3];
                    const coupon = await Coupon.findByIdAndDelete(resourceId);
                    if (coupon) await logActivity(user.id, user.username, 'DELETE_COUPON', `Deleted coupon ${coupon.code}`);
                    return res.json({ message: 'Coupon deleted successfully' });
                }
            }

            // 6. Products
            if (endpoint === 'products') {
                const user = requireAuth(req, res, ['admin', 'superadmin']);
                if (!user) return;
                if (req.method === 'PATCH') {
                    const productId = pathParts[3];
                    if (!productId) return res.status(400).json({ message: 'Product ID required' });
                    const product = await Product.findOneAndUpdate(
                        { id: productId },
                        { $set: { ...req.body, updatedAt: new Date() } },
                        { new: true }
                    );
                    if (!product) return res.status(404).json({ message: 'Product not found' });
                    await logActivity(user.id, user.username, 'UPDATE_PRODUCT', `Updated product ${productId}`);
                    return res.json(product);
                }
            }

            // 7. Reports
            if (endpoint === 'reports') {
                const user = requireAuth(req, res, ['admin', 'superadmin']);
                if (!user) return;
                const sub = pathParts[3];
                if (sub === 'sales') {
                    const { startDate, endDate } = req.query;
                    const start = new Date(startDate);
                    const end = new Date(endDate);
                    const orders = await Order.find({ createdAt: { $gte: start, $lte: end } });
                    const completed = orders.filter(o => o.status === 'completed');
                    const revenue = completed.reduce((s, o) => s + o.totalAmount, 0);
                    const customersCount = await Customer.countDocuments();
                    return res.json({
                        totalRevenue: revenue,
                        totalOrders: orders.length,
                        completedOrders: completed.length,
                        pendingOrders: orders.filter(o => o.status === 'pending').length,
                        totalCustomers: customersCount,
                        orders
                    });
                }
            }

            // 8. Search
            if (endpoint === 'search') {
                const user = requireAuth(req, res, ['admin', 'superadmin']);
                if (!user) return;
                const { q } = req.query;
                if (!q) return res.json({ orders: [], customers: [] });
                const regex = new RegExp(q, 'i');
                const [orders, customers] = await Promise.all([
                    Order.find({ $or: [{ orderNumber: regex }, { customerName: regex }, { customerEmail: regex }] }).limit(20),
                    Customer.find({ $or: [{ name: regex }, { email: regex }, { phone: regex }] }).limit(20)
                ]);
                return res.json({ orders, customers });
            }

            // --- SuperAdmin Only ---
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
                    const id = req.query.id || pathParts[3];
                    if (!id) return res.status(400).json({ message: 'User ID required' });
                    await User.findByIdAndDelete(id);
                    return res.json({ message: 'Admin user deleted successfully' });
                }
            }

            // 9. Activity
            if (endpoint === 'activity') {
                const user = requireAuth(req, res, ['superadmin']);
                if (!user) return;
                if (req.method === 'GET') {
                    const adminId = pathParts[3]; // /api/admin/activity/:id
                    if (!adminId) return res.status(400).json({ message: 'Admin ID required' });
                    const logs = await ActivityLog.find({ adminId }).sort({ timestamp: -1 });
                    return res.json(logs);
                }
            }

            // 10. Blog Management (Admin)
            if (endpoint === 'blogs') {
                const id = pathParts[3]; // /api/admin/blogs/:id
                const action = pathParts[4]; // /api/admin/blogs/:id/toggle

                // GET all blogs (admin)
                if (req.method === 'GET' && !id) {
                    const user = requireAuth(req, res);
                    if (!user) return;
                    const blogs = await BlogPost.find().sort({ createdAt: -1 });
                    return res.json(blogs);
                }

                // POST create new blog
                if (req.method === 'POST' && !id) {
                    const user = requireAuth(req, res);
                    if (!user) return;
                    const { link, title, caption, author } = req.body;
                    if (!link || !caption) {
                        return res.status(400).json({ message: 'Link and Caption are required' });
                    }
                    const blog = await BlogPost.create({
                        link,
                        title: title || '',
                        caption,
                        author: author || user.username
                    });
                    await logActivity(user.id, user.username, 'Created Blog Post', `Title: ${title || caption.substring(0, 50)}`);
                    return res.status(201).json({ message: 'Blog post created', blog });
                }

                // PATCH toggle blog status
                if (req.method === 'PATCH' && id && action === 'toggle') {
                    const user = requireAuth(req, res);
                    if (!user) return;
                    const blog = await BlogPost.findById(id);
                    if (!blog) return res.status(404).json({ message: 'Blog post not found' });
                    blog.isActive = !blog.isActive;
                    await blog.save();
                    await logActivity(user.id, user.username, 'Toggled Blog Status', `Post: ${blog.title || blog.caption.substring(0, 30)} -> ${blog.isActive ? 'Active' : 'Inactive'}`);
                    return res.json(blog);
                }

                // DELETE blog post
                if (req.method === 'DELETE' && id) {
                    const user = requireAuth(req, res);
                    if (!user) return;
                    const blog = await BlogPost.findById(id);
                    if (blog) {
                        await logActivity(user.id, user.username, 'Deleted Blog Post', `Title: ${blog.title || blog.caption.substring(0, 30)}`);
                    }
                    await BlogPost.findByIdAndDelete(id);
                    return res.json({ message: 'Blog post deleted' });
                }
            }
        }

        // --- PUBLIC: Get Active Blogs ---
        if (section === 'blogs' && req.method === 'GET') {
            const blogs = await BlogPost.find({ isActive: true }).sort({ createdAt: -1 });
            return res.json(blogs);
        }

        return res.status(404).json({ message: 'API Route Not Found' });
    } catch (error) {
        console.error('API Error:', error);
        return res.status(500).json({ message: 'Server Internal Error' });
    }
}
