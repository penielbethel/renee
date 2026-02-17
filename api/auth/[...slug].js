import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectDB } from '../_lib/db.js';
import { User, Token, logActivity } from '../_lib/models.js';
import { applyCors } from '../_lib/cors.js';

export default async function handler(req, res) {
    if (applyCors(req, res)) return;

    const path = req.url.split('?')[0];
    const endpoint = path.split('/').pop();

    try {
        await connectDB();

        if (endpoint === 'login' && req.method === 'POST') {
            const { username, password } = req.body || {};
            if (!username || !password) return res.status(400).json({ message: 'Username and password are required' });
            const user = await User.findOne({ username, role: 'admin' });
            if (!user) return res.status(401).json({ message: 'Invalid credentials' });
            const match = await bcrypt.compare(password, user.password || '');
            if (!match) return res.status(401).json({ message: 'Invalid credentials' });
            const token = jwt.sign({ id: user._id, username: user.username, role: 'admin' }, process.env.JWT_SECRET);
            await logActivity(user._id, user.username, 'LOGIN', 'Admin logged in');
            return res.json({ token, user: { username: user.username, role: 'admin' } });
        }

        if (endpoint === 'register-admin' && req.method === 'POST') {
            const { username, password, tokenCode } = req.body || {};
            const tokenDoc = await Token.findOne({ code: tokenCode, used: false });
            if (!tokenDoc) return res.status(400).json({ message: 'Invalid or already used registration token' });
            if (new Date() > tokenDoc.expiresAt) return res.status(400).json({ message: 'Registration token has expired' });
            const existingUser = await User.findOne({ username });
            if (existingUser) return res.status(400).json({ message: 'Username already exists' });
            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, password: hashedPassword, role: 'admin' });
            await newUser.save();
            tokenDoc.used = true;
            await tokenDoc.save();
            return res.status(201).json({ message: 'Admin registered successfully' });
        }

        if (endpoint === 'super-login' && req.method === 'POST') {
            const { username } = req.body || {};
            const superAdmins = ['pbmsrvr', 'anthony'];
            if (!username || !superAdmins.includes(username)) return res.status(401).json({ message: 'Invalid SuperAdmin username' });
            let user = await User.findOne({ username });
            if (!user) {
                user = new User({ username, role: 'superadmin' });
                await user.save();
            } else if (user.role !== 'superadmin') {
                user.role = 'superadmin';
                await user.save();
            }
            const token = jwt.sign({ id: user._id, username: user.username, role: 'superadmin' }, process.env.JWT_SECRET, { expiresIn: '24h' });
            await logActivity(user._id, user.username, 'LOGIN', 'SuperAdmin logged in');
            return res.json({ token, user: { username: user.username, role: 'superadmin' } });
        }

        return res.status(404).json({ message: 'Auth endpoint not found' });
    } catch (error) {
        console.error('Auth error:', error);
        return res.status(500).json({ message: 'Server error' });
    }
}
