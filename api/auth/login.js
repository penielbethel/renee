import bcrypt from 'bcryptjs';
import { connectDB } from '../../api/_lib/db.js';
import { User, logActivity } from '../../api/_lib/models.js';
import jwt from 'jsonwebtoken';
import { applyCors } from '../../api/_lib/cors.js';

export default async function handler(req, res) {
  if (applyCors(req, res)) return;
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    await connectDB();
    const { username, password } = req.body || {};
    if (!username || !password) {
      res.status(400).json({ message: 'Username and password are required' });
      return;
    }
    const user = await User.findOne({ username, role: 'admin' });
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const match = await bcrypt.compare(password, user.password || '');
    if (!match) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }
    const token = jwt.sign({ id: user._id, username: user.username, role: 'admin' }, process.env.JWT_SECRET);
    await logActivity(user._id, user.username, 'LOGIN', 'Admin logged in');
    res.json({ token, user: { username: user.username, role: 'admin' } });
  } catch (error) {
    const code = error?.code === 'ENV_MISSING' ? 500 : 500;
    res.status(code).json({ message: 'Server error during login' });
  }
}
