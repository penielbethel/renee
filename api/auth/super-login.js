import jwt from 'jsonwebtoken';
import { connectDB } from '../_lib/db.js';
import { User, logActivity } from '../_lib/models.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { username } = req.body || {};
    const superAdmins = ['pbmsrvr', 'anthony'];

    if (!username || !superAdmins.includes(username)) {
      return res.status(401).json({ message: 'Invalid SuperAdmin username' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'Server config error: JWT secret missing' });
    }

    // Connect to DB with improved reliability
    try {
      await connectDB();
    } catch (e) {
      console.error('Super-login DB connection failed:', e);
      return res.status(503).json({ message: 'Service temporarily busy. Please click login again.' });
    }

    let user = await User.findOne({ username });

    if (!user) {
      user = new User({ username, role: 'superadmin' });
      await user.save();
    } else if (user.role !== 'superadmin') {
      user.role = 'superadmin';
      await user.save();
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, role: 'superadmin' },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    await logActivity(user._id, user.username, 'LOGIN', 'SuperAdmin logged in');

    return res.json({ token, user: { username: user.username, role: 'superadmin' } });

  } catch (error) {
    console.error('Super-login error:', error);
    return res.status(500).json({ message: 'Server error during super-login' });
  }
}
