import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { applyCors } from '../../api/_lib/cors.js';

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;
  await mongoose.connect(process.env.MONGODB_URI);
  isConnected = true;
};

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
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

const User = mongoose.models.User || mongoose.model('User', UserSchema);
const ActivityLog = mongoose.models.ActivityLog || mongoose.model('ActivityLog', ActivityLogSchema);

const logActivity = async (adminId, adminName, action, details) => {
  try {
    await ActivityLog.create({ adminId, adminName, action, details });
  } catch (e) {}
};

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }

  try {
    const { username } = req.body || {};
    const superAdmins = ['pbmsrvr', 'anthony'];

    if (!username || !superAdmins.includes(username)) {
      res.status(401).json({ message: 'Invalid SuperAdmin username' });
      return;
    }

    // Try DB connect quickly; fallback to stateless token if DB unavailable
    let dbOk = true;
    try { await connectDB(); } catch (e) { dbOk = false; }

    if (!process.env.JWT_SECRET) {
      res.status(500).json({ message: 'Server config error: JWT secret missing' });
      return;
    }

    if (dbOk) {
      let user = await User.findOne({ username });
      if (!user) {
        user = new User({ username, role: 'superadmin' });
        await user.save();
      } else if (user.role !== 'superadmin') {
        user.role = 'superadmin';
        await user.save();
      }
      const token = jwt.sign({ id: user._id, username: user.username, role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
      await logActivity(user._id, user.username, 'LOGIN', 'SuperAdmin logged in');
      res.json({ token, user: { username: user.username, role: 'superadmin' } });
      return;
    }

    // Fallback: issue stateless token for immediate login; downstream routes will still require DB
    const token = jwt.sign({ id: `superadmin-${username}`, username, role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token, user: { username, role: 'superadmin' } });
  } catch (error) {
    res.status(500).json({ message: 'Server error during super-login' });
  }
}
