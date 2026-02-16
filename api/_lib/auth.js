import jwt from 'jsonwebtoken';

export function requireAuth(req, res, roles = []) {
  const authHeader = req.headers['authorization'] || req.headers['Authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    res.status(401).json({ message: 'Missing token' });
    return null;
  }
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    if (roles.length && !roles.includes(user.role)) {
      res.status(403).json({ message: 'Forbidden' });
      return null;
    }
    return user;
  } catch (e) {
    res.status(403).json({ message: 'Invalid token' });
    return null;
  }
}
