import express from 'express';
import mongoose from 'mongoose';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// --- MODELS ---
const TokenSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true },
    used: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    expiresAt: { type: Date, required: true }
});
const Token = mongoose.model('Token', TokenSchema);

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String }, // Optional for SuperAdmins
    role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
    createdAt: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const ActivityLogSchema = new mongoose.Schema({
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    adminName: String,
    action: String,
    details: String,
    timestamp: { type: Date, default: Date.now }
});
const ActivityLog = mongoose.model('ActivityLog', ActivityLogSchema);

const logActivity = async (adminId, adminName, action, details) => {
    try { await ActivityLog.create({ adminId, adminName, action, details }); }
    catch (e) { console.error('Log Error:', e); }
};

// Order Schema
const OrderSchema = new mongoose.Schema({
    orderNumber: { type: String, required: true, unique: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
    customerPhone: { type: String },
    items: [{
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true }
    }],
    totalAmount: { type: Number, required: true },
    appliedCoupon: {
        code: String,
        discountAmount: Number
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'completed', 'cancelled'],
        default: 'pending'
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'refunded'],
        default: 'unpaid'
    },
    createdAt: { type: Date, default: Date.now },
    completedAt: { type: Date }
});
const Order = mongoose.model('Order', OrderSchema);

// Customer Schema
const CustomerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
    lastOrderDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
});
const Customer = mongoose.model('Customer', CustomerSchema);

// Product Schema
const ProductSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    category: { type: String, required: true },
    tagline: { type: String },
    size: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    isNewArrival: { type: Boolean, default: false },
    stockStatus: { type: String, enum: ['in_stock', 'low_stock', 'out_of_stock'], default: 'in_stock' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
const Product = mongoose.model('Product', ProductSchema);

// Coupon Schema
const CouponSchema = new mongoose.Schema({
    code: { type: String, required: true, unique: true, uppercase: true },
    discountPercent: { type: Number, required: true, min: 5, max: 50 },
    applicableProducts: [{ type: String }], // Empty array means all products
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 1 }, // How many times total it can be used
    usedBy: [{
        email: String,
        usedAt: { type: Date, default: Date.now }
    }],
    isActive: { type: Boolean, default: true },
    createdBy: { type: String }, // Admin email
    createdAt: { type: Date, default: Date.now }
});
const Coupon = mongoose.model('Coupon', CouponSchema);

// Promo Schema
const PromoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    discountPercent: { type: Number, required: true },
    applicableProducts: [{ type: String }], // Empty = All
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    createdBy: { type: String }
}, { timestamps: true });
const Promo = mongoose.model('Promo', PromoSchema);

// Blog Schema
const BlogSchema = new mongoose.Schema({
    link: { type: String, required: true }, // URL to image or article
    title: { type: String, default: '' }, // Headline of the post
    caption: { type: String, required: true },
    author: { type: String, required: true }, // Admin Name
    isActive: { type: Boolean, default: true },
    createdAt: { type: Date, default: Date.now }
});
const BlogPost = mongoose.model('BlogPost', BlogSchema);

// --- AUTH MIDDLEWARE ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

// --- ROUTES ---

// SuperAdmin Automatic Login
app.post('/api/auth/super-login', async (req, res) => {
    try {
        const { username } = req.body;
        const superAdmins = ['pbmsrvr', 'techadvantage'];

        if (superAdmins.includes(username)) {
            const superAdminNames = {
                'pbmsrvr': 'YINKA MICHAEL',
                'techadvantage': 'ANTHONY APEJI'
            };
            const fullName = superAdminNames[username];

            // Find user by username only first to avoid duplicate key errors
            let user = await User.findOne({ username });

            if (!user) {
                user = new User({ username, fullName, role: 'superadmin' });
                await user.save();
            } else {
                // Ensure correct role and name
                user.role = 'superadmin';
                user.fullName = fullName;
                await user.save();
            }

            const token = jwt.sign({ id: user._id, username: user.username, role: 'superadmin' }, process.env.JWT_SECRET);

            // Log the SuperAdmin login
            await logActivity(user._id, user.username, 'LOGIN', 'SuperAdmin logged in');

            return res.json({ token, user: { username: user.username, fullName: user.fullName, role: 'superadmin' } });
        }

        return res.status(401).json({ message: 'Invalid SuperAdmin username' });
    } catch (error) {
        console.error('Super-login error:', error);
        res.status(500).json({ message: 'Server error during super-login' });
    }
});

// Admin Registration (Requires Token)
app.post('/api/auth/register-admin', async (req, res) => {
    const { username, password, tokenCode } = req.body;

    try {
        // Check Token existence and if used
        const tokenDoc = await Token.findOne({ code: tokenCode, used: false });
        if (!tokenDoc) {
            return res.status(400).json({ message: 'Invalid or already used registration token' });
        }

        // Check Token expiration
        if (new Date() > tokenDoc.expiresAt) {
            return res.status(400).json({ message: 'Registration token has expired' });
        }

        // Check if user exists
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: 'Username already exists' });
        }

        // Create Admin
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            username,
            password: hashedPassword,
            role: 'admin'
        });

        await newUser.save();

        // Mark token as used
        tokenDoc.used = true;
        await tokenDoc.save();

        res.status(201).json({ message: 'Admin registered successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// Admin Login
app.post('/api/auth/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, role: 'admin' });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id, username: user.username, role: 'admin' }, process.env.JWT_SECRET);
        await logActivity(user._id, user.username, 'LOGIN', 'Admin logged in');
        res.json({ token, user: { username: user.username, role: 'admin' } });
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// SuperAdmin: Generate Registration Token
app.post('/api/admin/generate-token', authenticateToken, async (req, res) => {
    if (req.user.role !== 'superadmin') return res.sendStatus(403);

    const code = Math.random().toString(36).substring(2, 10).toUpperCase();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    const newToken = new Token({ code, expiresAt });
    await newToken.save();

    res.json({ code });
});

// SuperAdmin: Delete Token
app.delete('/api/admin/tokens/:id', authenticateToken, async (req, res) => {
    console.log('DELETE /api/admin/tokens/' + req.params.id + ' requested by ' + req.user.username);
    if (req.user.role !== 'superadmin') return res.sendStatus(403);
    try {
        const deletedToken = await Token.findByIdAndDelete(req.params.id);
        if (!deletedToken) {
            console.log('Token not found in DB:', req.params.id);
            return res.status(404).json({ message: 'Token not found in database' });
        }
        console.log('Token deleted successfully');
        res.json({ message: 'Token deleted' });
    } catch (err) {
        console.error('Error deleting token:', err);
        res.status(500).json({ message: 'Database error deleting token' });
    }
});

// SuperAdmin: Delete User
app.delete('/api/admin/users/:id', authenticateToken, async (req, res) => {
    console.log('DELETE /api/admin/users/' + req.params.id + ' requested by ' + req.user.username);
    if (req.user.role !== 'superadmin') return res.sendStatus(403);
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (deletedUser) {
            await logActivity(req.user.id, req.user.username, 'DELETE_ADMIN', `Deleted admin user "${deletedUser.username}"`);
        }
        res.json({ message: 'Admin user deleted' });
    } catch (err) {
        res.status(500).json({ message: 'Server error deleting user' });
    }
});

// SuperAdmin: Get all tokens
app.get('/api/admin/tokens', authenticateToken, async (req, res) => {
    if (req.user.role !== 'superadmin') return res.sendStatus(403);
    const tokens = await Token.find().sort({ createdAt: -1 });
    res.json(tokens);
});

// SuperAdmin: Get all users
app.get('/api/admin/users', authenticateToken, async (req, res) => {
    if (req.user.role !== 'superadmin') return res.sendStatus(403);
    const users = await User.find({ role: 'admin' }).select('-password');
    res.json(users);
});

// SuperAdmin: Get Activity Logs
app.get('/api/admin/activity/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'superadmin') return res.sendStatus(403);
    try {
        const logs = await ActivityLog.find({ adminId: req.params.id }).sort({ timestamp: -1 });
        res.json(logs);
    } catch (e) { res.status(500).json({ message: 'Error fetching logs' }); }
});

// --- GLOBAL SEARCH ---
app.get('/api/admin/search', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);
    try {
        const q = req.query.q;
        if (!q || q.trim().length < 2) return res.json({ orders: [], customers: [] });

        const regex = new RegExp(q.trim(), 'i');

        const [orders, customers] = await Promise.all([
            Order.find({
                $or: [
                    { orderNumber: regex },
                    { customerName: regex },
                    { customerEmail: regex },
                    { customerPhone: regex }
                ]
            }).sort({ createdAt: -1 }).limit(20),
            Customer.find({
                $or: [
                    { name: regex },
                    { email: regex },
                    { phone: regex }
                ]
            }).sort({ createdAt: -1 }).limit(10)
        ]);

        res.json({ orders, customers });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Search failed' });
    }
});

// --- PRODUCT MANAGEMENT ROUTES ---

// Get all products (Public)
app.get('/api/products', async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: 1 });
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Server error fetching products' });
    }
});

// Update product price (Admin)
app.patch('/api/admin/products/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const { price, name, description, size, category, tagline, isNewArrival, stockStatus } = req.body;
        const product = await Product.findOne({ id: req.params.id });

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        // Update fields if provided
        if (price !== undefined) product.price = price;
        if (name) product.name = name;
        if (description) product.description = description;
        if (size) product.size = size;
        if (category) product.category = category;
        if (tagline) product.tagline = tagline;
        if (isNewArrival !== undefined) product.isNewArrival = isNewArrival;
        if (stockStatus) product.stockStatus = stockStatus;

        product.updatedAt = new Date();
        await product.save();

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Server error updating product' });
    }
});

// Initialize products (Admin - one-time setup)
app.post('/api/admin/products/initialize', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const existingProducts = await Product.countDocuments();
        if (existingProducts > 0) {
            return res.status(400).json({ message: 'Products already initialized' });
        }

        const initialProducts = [
            {
                id: 'kulikuli-small',
                name: 'Renee Kulikuli',
                category: 'Snacks',
                tagline: 'Traditional Groundnut Cookies',
                size: 'Small Pack',
                description: 'Crunchy, authentic groundnut cookies. Perfectly spiced for a light, healthy snack.',
                price: 500,
                image: '/images/Renee Kulikuli-S.jpg',
                rating: 4.8,
                reviews: 124
            },
            {
                id: 'kulikuli-medium',
                name: 'Renee Kulikuli',
                category: 'Snacks',
                tagline: 'Traditional Groundnut Cookies',
                size: 'Family Pack',
                description: 'Larger pack of our signature crunchy cookies, ideal for sharing with family.',
                price: 900,
                image: '/images/Renee Kulikuli-M.jpg',
                rating: 4.9,
                reviews: 86
            },
            {
                id: 'kulikuli-regular',
                name: 'Renee Kulikuli',
                category: 'Snacks',
                tagline: 'Traditional Groundnut Cookies',
                size: 'Premium Pack',
                description: 'The standard premium pack. Carefully packaged to retain that fresh, spicy crunch.',
                price: 1500,
                image: '/images/ReneeKulikuli-R.jpg',
                rating: 5.0,
                reviews: 215
            },
            {
                id: 'emi-kuli-oil',
                name: 'Renee Oils',
                category: 'Oils',
                tagline: '100% Pure Groundnut Oil',
                size: '1 Litre Bottle',
                description: 'Cholesterol-free, cold-pressed groundnut oil. Perfectly clear and heart-healthy.',
                price: 3500,
                image: '/images/Renee Oil1.jpg',
                rating: 4.9,
                reviews: 98
            },
            {
                id: 'tigernut-drink',
                name: 'Renee Tigernut',
                category: 'Drinks',
                tagline: 'Natural Energy Boost',
                size: '500ml Bottle',
                description: 'Creamy, refreshing tigernut drink. Rich in fiber and natural nutrients.',
                price: 2000,
                image: '/images/Renee Tigernut.jpg',
                rating: 4.7,
                reviews: 142
            },
            {
                id: 'rice',
                name: 'Renee Rice',
                category: 'Staples',
                tagline: 'Premium Parboiled Rice',
                size: '5kg Bag',
                description: 'Stone-free, long-grain parboiled rice. Polished and ready for your delicious meals.',
                price: 8000,
                image: '/images/renee Rice.jpg',
                rating: 5.0,
                reviews: 310
            },
            {
                id: 'honey',
                name: 'Renee Honey',
                category: 'Sweeteners',
                tagline: '100% Raw Wild Honey',
                size: '500g Bottle',
                description: 'Directly from the hive. Unadulterated raw honey with all its natural goodness.',
                price: 3000,
                image: '/images/Renee Honey.jpg',
                rating: 4.9,
                reviews: 167
            }
        ];

        await Product.insertMany(initialProducts);
        res.json({ message: 'Products initialized successfully', count: initialProducts.length });
    } catch (error) {
        console.error('Error initializing products:', error);
        res.status(500).json({ message: 'Server error initializing products' });
    }
});

// --- ORDER MANAGEMENT ROUTES ---

// Create Order (Public - from Shop page)
app.post('/api/orders', async (req, res) => {
    try {
        const { customerName, customerEmail, customerPhone, items, totalAmount, couponCode, discountAmount } = req.body;

        // Handle Coupon Logic if code provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (coupon) {
                // Determine if valid to use
                const now = new Date();
                const usedCount = coupon.usedBy.length;
                const userUsed = coupon.usedBy.some(u => u.email === customerEmail);

                if (coupon.isActive &&
                    (now >= coupon.startDate || now.toDateString() === coupon.startDate.toDateString()) &&
                    now <= coupon.endDate &&
                    usedCount < coupon.usageLimit &&
                    !userUsed) {

                    // Mark as used
                    coupon.usedBy.push({ email: customerEmail, usedAt: new Date() });
                    await coupon.save();
                } else {
                    // Start thinking: Should we fail the order if coupon invalid?
                    // For now, let's just log it or maybe strip the coupon?
                    // But if the totalAmount reflects the discount, we have a mismatch.
                    // Ideally, we should recalculate total.
                    console.warn(`Invalid coupon usage attempt: ${couponCode} by ${customerEmail}`);
                    // return res.status(400).json({ message: 'Coupon invalid or expired' }); 
                    // Let's proceed but maybe without marking used if it was already invalid? 
                    // Actually, let's trigger usage if valid.
                }
            }
        }

        // Generate order number if not provided
        const orderNumber = req.body.orderNumber || ('ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7).toUpperCase());

        // Create order
        const order = new Order({
            orderNumber,
            customerName,
            customerEmail,
            customerPhone,
            items,
            totalAmount,
            appliedCoupon: couponCode ? { code: couponCode, discountAmount } : undefined,
            status: 'pending',
            paymentStatus: 'unpaid'
        });

        await order.save();

        // Update or create customer
        let customer = await Customer.findOne({ email: customerEmail });
        if (customer) {
            customer.totalOrders += 1;
            customer.totalSpent += totalAmount;
            customer.lastOrderDate = new Date();
            customer.name = customerName; // Update name if changed
            customer.phone = customerPhone || customer.phone;
        } else {
            customer = new Customer({
                name: customerName,
                email: customerEmail,
                phone: customerPhone,
                totalOrders: 1,
                totalSpent: totalAmount,
                lastOrderDate: new Date()
            });
        }
        await customer.save();

        res.status(201).json({
            message: 'Order created successfully',
            orderNumber,
            order
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Server error creating order' });
    }
});

// Get All Orders (Admin)
app.get('/api/admin/orders', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching orders' });
    }
});

// Get Analytics (Admin)
app.get('/api/admin/analytics', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        startOfWeek.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfYear = new Date(now.getFullYear(), 0, 1);

        // Weekly stats
        const weeklyOrders = await Order.find({
            createdAt: { $gte: startOfWeek },
            status: 'completed'
        });

        // Monthly stats
        const monthlyOrders = await Order.find({
            createdAt: { $gte: startOfMonth },
            status: 'completed'
        });

        // Yearly stats
        const yearlyOrders = await Order.find({
            createdAt: { $gte: startOfYear },
            status: 'completed'
        });

        // Total stats
        const totalOrders = await Order.countDocuments({ status: 'completed' });
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'completed' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);

        // Customer count
        const totalCustomers = await Customer.countDocuments();

        // Recent orders
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);

        res.json({
            weekly: {
                orders: weeklyOrders.length,
                revenue: weeklyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            },
            monthly: {
                orders: monthlyOrders.length,
                revenue: monthlyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            },
            yearly: {
                orders: yearlyOrders.length,
                revenue: yearlyOrders.reduce((sum, order) => sum + order.totalAmount, 0)
            },
            total: {
                orders: totalOrders,
                revenue: totalRevenue[0]?.total || 0,
                customers: totalCustomers
            },
            recentOrders
        });
    } catch (error) {
        console.error('Analytics error:', error);
        res.status(500).json({ message: 'Server error fetching analytics' });
    }
});

// Get All Customers (Admin)
app.get('/api/admin/customers', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const customers = await Customer.find().sort({ totalSpent: -1 });
        res.json(customers);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching customers' });
    }
});

// Get Customer Orders (Admin)
app.get('/api/admin/customers/:email/orders', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const orders = await Order.find({ customerEmail: req.params.email }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
    }
});

// Delete Customer (Admin)
app.delete('/api/admin/customers/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);
    try {
        const customer = await Customer.findByIdAndDelete(req.params.id);
        if (customer) await logActivity(req.user.id, req.user.username, 'DELETE_CUSTOMER', `Deleted customer ${customer.email}`);
        res.json({ message: 'Customer deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting customer' });
    }
});

// Update Order Status (Admin)
app.patch('/api/admin/orders/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const { status, paymentStatus } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        if (status) order.status = status;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        if (status === 'completed' && !order.completedAt) {
            order.completedAt = new Date();
        }

        await order.save();
        res.json({ message: 'Order updated successfully', order });
    } catch (error) {
        console.error('Error updating order:', error);
    }
});

// Delete Order (Admin)
app.delete('/api/admin/orders/:id', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);
    try {
        const order = await Order.findByIdAndDelete(req.params.id);
        if (order) await logActivity(req.user.id, req.user.username, 'DELETE_ORDER', `Deleted order ${order.orderNumber}`);
        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting order' });
    }
});

// Verify Payment (Flutterwave)
app.post('/api/payment/verify', async (req, res) => {
    try {
        const { transaction_id, order_id } = req.body;

        // Verify with Flutterwave
        const flwResponse = await axios.get(`https://api.flutterwave.com/v3/transactions/${transaction_id}/verify`, {
            headers: {
                Authorization: `Bearer ${process.env.FLW_SECRET_KEY}`
            }
        });

        const data = flwResponse.data.data;

        if (flwResponse.data.status === 'success' && data.status === "successful") {
            // Find order by orderNumber (which we used as tx_ref)
            const order = await Order.findOne({ orderNumber: order_id });

            if (order) {
                // Check amount match if necessary
                // if (data.amount < order.totalAmount) ...

                order.paymentStatus = 'paid';
                order.status = 'processing'; // Auto-move to processing
                await order.save();

                return res.json({ status: 'success', message: 'Payment verified', order });
            } else {
                return res.status(404).json({ status: 'error', message: 'Order not found for verified transaction' });
            }
        }
        res.status(400).json({ status: 'error', message: 'Payment verification failed or pending' });
    } catch (error) {
        console.error("Payment verification error:", error.response?.data || error.message);
        res.status(500).json({ message: 'Server error verifying payment' });
    }
});

// Generate Sales Report (Admin)
app.get('/api/admin/reports/sales', authenticateToken, async (req, res) => {
    if (req.user.role !== 'admin' && req.user.role !== 'superadmin') return res.sendStatus(403);

    try {
        const { startDate, endDate } = req.query;

        const query = { status: 'completed' };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }

        const orders = await Order.find(query).sort({ createdAt: -1 });

        // Group by product
        const productSales = {};
        orders.forEach(order => {
            order.items.forEach(item => {
                if (!productSales[item.productName]) {
                    productSales[item.productName] = {
                        name: item.productName,
                        totalQuantity: 0,
                        totalRevenue: 0,
                        orderCount: 0
                    };
                }
                productSales[item.productName].totalQuantity += item.quantity;
                productSales[item.productName].totalRevenue += item.price * item.quantity;
                productSales[item.productName].orderCount += 1;
            });
        });

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            period: { startDate, endDate },
            totalOrders: orders.length,
            totalRevenue,
            productSales: Object.values(productSales),
            orders
        });
    } catch (error) {
        console.error('Report generation error:', error);
        res.status(500).json({ message: 'Server error generating report' });
    }
});

// ================== COUPON ENDPOINTS ==================

// Create Coupon (Admin only)
app.post('/api/admin/coupons', authenticateToken, async (req, res) => {
    try {
        const { code, discountPercent, applicableProducts, startDate, endDate, usageLimit } = req.body;

        // Validate discount percentage
        if (discountPercent < 5 || discountPercent > 50 || discountPercent % 5 !== 0) {
            return res.status(400).json({
                message: 'Discount must be between 5% and 50% in increments of 5%'
            });
        }

        // Validate dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        if (start >= end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const coupon = new Coupon({
            code: code.toUpperCase(),
            discountPercent,
            applicableProducts: applicableProducts || [],
            startDate: start,
            endDate: end,
            usageLimit: usageLimit || 1,
            createdBy: req.user.email
        });

        await coupon.save();
        res.status(201).json({ message: 'Coupon created successfully', coupon });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: 'Coupon code already exists' });
        }
        console.error('Error creating coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get all coupons (Admin only)
app.get('/api/admin/coupons', authenticateToken, async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({ createdAt: -1 });
        res.json(coupons);
    } catch (error) {
        console.error('Error fetching coupons:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get active coupons (Public - for displaying active promos)
app.get('/api/coupons/active', async (req, res) => {
    try {
        const now = new Date();
        const activeCoupons = await Coupon.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now }
        });

        // Return only necessary info (hide usage details)
        const publicCoupons = activeCoupons.map(c => ({
            code: c.code,
            discountPercent: c.discountPercent,
            applicableProducts: c.applicableProducts,
            endDate: c.endDate
        }));

        res.json(publicCoupons);
    } catch (error) {
        console.error('Error fetching active coupons:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Validate and apply coupon
app.post('/api/coupons/validate', async (req, res) => {
    try {
        const { code, email, productIds } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ valid: false, message: 'Invalid coupon code' });
        }

        const now = new Date();

        // Check if active
        if (!coupon.isActive) {
            return res.status(400).json({ valid: false, message: 'Coupon is inactive' });
        }

        // Check date validity
        if (now < coupon.startDate && now.toDateString() !== coupon.startDate.toDateString()) {
            return res.status(400).json({ valid: false, message: 'Coupon not yet active' });
        }
        if (now > coupon.endDate) {
            return res.status(400).json({ valid: false, message: 'Coupon has expired' });
        }

        // Check if user already used this coupon
        const alreadyUsed = coupon.usedBy.some(usage => usage.email === email);
        if (alreadyUsed) {
            return res.status(400).json({ valid: false, message: 'You have already used this coupon' });
        }

        // Check usage limit
        if (coupon.usedBy.length >= coupon.usageLimit) {
            return res.status(400).json({ valid: false, message: 'Coupon usage limit reached' });
        }

        // Check if applicable to products
        if (coupon.applicableProducts.length > 0 && productIds) {
            const hasApplicableProduct = productIds.some(id =>
                coupon.applicableProducts.includes(id)
            );
            if (!hasApplicableProduct) {
                return res.status(400).json({
                    valid: false,
                    message: 'Coupon not applicable to selected products'
                });
            }
        }

        res.json({
            valid: true,
            discountPercent: coupon.discountPercent,
            applicableProducts: coupon.applicableProducts,
            message: `${coupon.discountPercent}% discount applied!`
        });
    } catch (error) {
        console.error('Error validating coupon:', error);
        res.status(500).json({ valid: false, message: 'Server error' });
    }
});

// Apply coupon (mark as used)
app.post('/api/coupons/apply', async (req, res) => {
    try {
        const { code, email } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        // Add to usedBy array
        coupon.usedBy.push({ email, usedAt: new Date() });
        await coupon.save();

        res.json({ message: 'Coupon applied successfully' });
    } catch (error) {
        console.error('Error applying coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete coupon (Admin only)
app.delete('/api/admin/coupons/:id', authenticateToken, async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: 'Coupon deleted successfully' });
    } catch (error) {
        console.error('Error deleting coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle coupon active status (Admin only)
app.patch('/api/admin/coupons/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);
        if (!coupon) {
            return res.status(404).json({ message: 'Coupon not found' });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({ message: 'Coupon status updated', coupon });
    } catch (error) {
        console.error('Error toggling coupon:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// ================== PROMO ENDPOINTS ==================

// Create Promo (Admin)
app.post('/api/admin/promos', authenticateToken, async (req, res) => {
    try {
        const { title, discountPercent, applicableProducts, startDate, endDate } = req.body;

        if (discountPercent < 5 || discountPercent > 90) {
            return res.status(400).json({ message: 'Discount must be between 5% and 90%' });
        }

        const start = new Date(startDate + 'T00:00:00');
        const end = new Date(endDate + 'T23:59:59');

        if (start >= end) {
            return res.status(400).json({ message: 'End date must be after start date' });
        }

        const promo = new Promo({
            title,
            discountPercent,
            applicableProducts: applicableProducts || [],
            startDate: start,
            endDate: end,
            createdBy: req.user.email
        });

        await promo.save();
        res.status(201).json({ message: 'Promo created successfully', promo });
    } catch (error) {
        console.error('Error creating promo:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get Active Promos (Public)
app.get('/api/promos/active', async (req, res) => {
    try {
        const now = new Date();
        const activePromos = await Promo.find({
            isActive: true,
            endDate: { $gte: now }
        });

        // Filter start date leniently
        const validPromos = activePromos.filter(promo => {
            return (now >= promo.startDate || now.toDateString() === promo.startDate.toDateString());
        });

        res.json(validPromos);
    } catch (error) {
        console.error('Error fetching active promos:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Promos (Admin)
app.get('/api/admin/promos', authenticateToken, async (req, res) => {
    try {
        const promos = await Promo.find().sort({ createdAt: -1 });
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle Promo Status (Admin)
app.patch('/api/admin/promos/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const promo = await Promo.findById(req.params.id);
        if (!promo) return res.status(404).json({ message: 'Promo not found' });

        promo.isActive = !promo.isActive;
        await promo.save();
        res.json(promo);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Promo (Admin)
app.delete('/api/admin/promos/:id', authenticateToken, async (req, res) => {
    try {
        await Promo.findByIdAndDelete(req.params.id);
        res.json({ message: 'Promo deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// ================== BLOG ENDPOINTS ==================

// Get Active Blogs (Public)
app.get('/api/blogs', async (req, res) => {
    try {
        const blogs = await BlogPost.find({ isActive: true }).sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Get All Blogs (Admin)
app.get('/api/admin/blogs', authenticateToken, async (req, res) => {
    try {
        const blogs = await BlogPost.find().sort({ createdAt: -1 });
        res.json(blogs);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Create Blog Post (Admin)
app.post('/api/admin/blogs', authenticateToken, async (req, res) => {
    try {
        const { link, title, caption, author } = req.body;

        if (!link || !caption) {
            return res.status(400).json({ message: 'Link and Caption are required' });
        }

        const blog = new BlogPost({
            link,
            title: title || '',
            caption,
            author: author || req.user.username // Use provided author name or fallback to username
        });

        await blog.save();
        res.status(201).json({ message: 'Blog post created', blog });
    } catch (error) {
        console.error('Error creating blog:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Toggle Blog Status (Admin)
app.patch('/api/admin/blogs/:id/toggle', authenticateToken, async (req, res) => {
    try {
        const blog = await BlogPost.findById(req.params.id);
        if (!blog) return res.status(404).json({ message: 'Blog post not found' });

        blog.isActive = !blog.isActive;
        await blog.save();
        res.json(blog);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Delete Blog Post (Admin)
app.delete('/api/admin/blogs/:id', authenticateToken, async (req, res) => {
    try {
        await BlogPost.findByIdAndDelete(req.params.id);
        res.json({ message: 'Blog post deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Test endpoint
app.get('/api/test', (req, res) => {
    console.log('Test endpoint hit');
    res.json({ message: 'Server is running and routes are working', timestamp: new Date() });
});

// 404 Logger - MUST BE LAST MIDDLEWARE (before app.listen)
app.use((req, res) => {
    console.log('404 Not Found: ' + req.method + ' ' + req.url);
    res.status(404).json({ message: 'Route not found on server' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
