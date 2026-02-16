import bcrypt from 'bcryptjs';
import { connectDB } from '../../api/_lib/db.js';
import { Token, User } from '../../api/_lib/models.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ message: 'Method Not Allowed' });
    return;
  }
  try {
    await connectDB();
    const { username, password, tokenCode } = req.body || {};

    const tokenDoc = await Token.findOne({ code: tokenCode, used: false });
    if (!tokenDoc) {
      res.status(400).json({ message: 'Invalid or already used registration token' });
      return;
    }
    if (new Date() > tokenDoc.expiresAt) {
      res.status(400).json({ message: 'Registration token has expired' });
      return;
    }
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      res.status(400).json({ message: 'Username already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, role: 'admin' });
    await newUser.save();

    tokenDoc.used = true;
    await tokenDoc.save();

    res.status(201).json({ message: 'Admin registered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error during registration' });
  }
}
