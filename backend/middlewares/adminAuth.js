import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';

export const protectAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 🔒 Check if header is present and starts with Bearer
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: '🚫 No token, authorization denied' });
    }

    const token = authHeader.split(' ')[1];

    // 🔍 Decode the token using the secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ message: '🚫 Invalid token payload' });
    }

    // 🧠 Fetch the admin and attach to req
    const admin = await Admin.findById(decoded.id).select('-password');
    if (!admin) {
      return res.status(401).json({ message: '🚫 Admin not found' });
    }

    req.admin = admin;
    next();
  } catch (error) {
    console.error('❌ Admin auth error:', error.message);
    return res.status(401).json({ message: '🚫 Token validation failed' });
  }
};
