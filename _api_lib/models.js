import mongoose from 'mongoose';

const TokenSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  used: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, required: true }
});

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  fullName: { type: String },
  password: { type: String },
  role: { type: String, enum: ['admin', 'superadmin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

const ActivityLogSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  adminName: String,
  action: String,
  details: String,
  timestamp: { type: Date, default: Date.now }
});

const OrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String },
  items: [{
    productName: String,
    quantity: Number,
    price: Number
  }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'processing', 'completed', 'cancelled'], default: 'pending' },
  paymentStatus: { type: String, enum: ['unpaid', 'paid', 'refunded'], default: 'unpaid' },
  createdAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

const CustomerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  totalOrders: { type: Number, default: 0 },
  totalSpent: { type: Number, default: 0 },
  lastOrderDate: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: String,
  tagline: String,
  size: String,
  description: String,
  price: Number,
  image: String,
  rating: Number,
  reviews: Number,
  isNewArrival: { type: Boolean, default: false },
  stockStatus: { type: String, default: 'in_stock' },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const CouponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  discountPercent: { type: Number, required: true },
  applicableProducts: { type: [String], default: [] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  usageLimit: { type: Number, default: 1 },
  usedBy: { type: [String], default: [] },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const PromoSchema = new mongoose.Schema({
  title: { type: String, required: true },
  discountPercent: { type: Number, required: true },
  applicableProducts: { type: [String], default: [] },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  isActive: { type: Boolean, default: true },
  createdBy: { type: String }
}, { timestamps: true });

const BlogPostSchema = new mongoose.Schema({
  link: { type: String, required: true },
  title: { type: String, default: '' },
  caption: { type: String, required: true },
  author: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

export const Token = mongoose.models.Token || mongoose.model('Token', TokenSchema);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);
export const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);
export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);
export const Customer = mongoose.models.Customer || mongoose.model('Customer', CustomerSchema);
export const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
export const Promo = mongoose.models.Promo || mongoose.model('Promo', PromoSchema);
export const Coupon = mongoose.models.Coupon || mongoose.model('Coupon', CouponSchema);
export const BlogPost = mongoose.models.BlogPost || mongoose.model('BlogPost', BlogPostSchema);

export const logActivity = async (adminId, adminName, action, details) => {
  try {
    await ActivityLog.create({ adminId, adminName, action, details });
  } catch (e) { }
};
