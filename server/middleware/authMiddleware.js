import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please log in.',
      });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'prepgenius_jwt_secret_dev_key_super_secure_2026';

    let decoded;
    try {
      decoded = jwt.verify(token, secret);
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired session token. Please log in again.',
      });
    }

    // Try finding user in database or fallback in-memory user
    let user = null;
    try {
      user = await User.findById(decoded.id).select('-passwordHash');
    } catch (e) {
      // If DB is offline or mock user is used
    }

    if (!user) {
      // Allow seamless mock token for testing if decoded object has id and email
      if (decoded.id && decoded.email) {
        req.user = {
          _id: decoded.id,
          id: decoded.id,
          name: decoded.name || 'Student Developer',
          email: decoded.email,
          targetRole: decoded.targetRole || 'Software Engineer',
          experienceLevel: decoded.experienceLevel || 'Fresher',
        };
        return next();
      }
      return res.status(401).json({
        success: false,
        message: 'User account not found.',
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};
