import jwt from 'jsonwebtoken';
import User from '../models/user.js';
import Admin from '../models/Admin.js';

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Invalid token format' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Try to find a user
    const user = await User.findById(decoded._id).select('-password');
    if (user) {
      req.user = {
        ...user._doc,
        id: user._id.toString(),
        role: 'user'
      };
      return next();
    }

    // Fallback: try to find an admin
    const admin = await Admin.findById(decoded.id).select('-password');
    if (admin) {
      req.user = {
        ...admin._doc,
        id: admin._id.toString(),
        role: 'admin'
      };
      return next();
    }

    return res.status(401).json({ message: 'User or Admin not found' });
  } catch (err) {
    console.error('❌ Token verification error:', err);
    return res.status(401).json({ message: 'Token invalid or expired' });
  }
};
