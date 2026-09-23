import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const generateToken = (user) => {
  const secret = process.env.JWT_SECRET || 'prepgenius_jwt_secret_dev_key_super_secure_2026';
  return jwt.sign(
    {
      id: user._id || user.id,
      email: user.email,
      name: user.name,
      targetRole: user.targetRole,
      experienceLevel: user.experienceLevel,
    },
    secret,
    { expiresIn: '7d' }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password, targetRole, experienceLevel, skills, preferredCompanies } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and password.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const existing = await User.findOne({ email: normalizedEmail });
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const passwordHash = await User.hashPassword(password);
      const user = await User.create({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        targetRole: targetRole || 'Software Engineer',
        experienceLevel: experienceLevel || 'Fresher',
        skills: Array.isArray(skills) ? skills : [],
        preferredCompanies: Array.isArray(preferredCompanies) ? preferredCompanies : [],
      });

      const token = generateToken(user);
      const userResponse = user.toObject();
      delete userResponse.passwordHash;

      return res.status(201).json({
        success: true,
        message: 'Account created successfully.',
        token,
        user: userResponse,
      });
    } else {
      // Memory store fallback
      const existing = memoryStore.findUserByEmail(normalizedEmail);
      if (existing) {
        return res.status(409).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = memoryStore.saveUser({
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
        targetRole: targetRole || 'Software Engineer',
        experienceLevel: experienceLevel || 'Fresher',
        skills: Array.isArray(skills) ? skills : ['JavaScript', 'React', 'Data Structures'],
        preferredCompanies: Array.isArray(preferredCompanies) ? preferredCompanies : ['Google', 'Amazon'],
      });

      const token = generateToken(user);
      const { passwordHash: _, ...safeUser } = user;

      return res.status(201).json({
        success: true,
        message: 'Account created successfully (development session).',
        token,
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password.',
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    if (isDbConnected()) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password.',
        });
      }

      const token = generateToken(user);
      const userResponse = user.toObject();
      delete userResponse.passwordHash;

      return res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: userResponse,
      });
    } else {
      // Memory store fallback
      let user = memoryStore.findUserByEmail(normalizedEmail);
      if (!user) {
        // Automatically create demo user on login in memory mode for easy testing if desired
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        user = memoryStore.saveUser({
          name: email.split('@')[0] || 'Demo Candidate',
          email: normalizedEmail,
          passwordHash,
          targetRole: 'Software Engineer',
          experienceLevel: 'Fresher',
          skills: ['JavaScript', 'React', 'DSA', 'SQL'],
          preferredCompanies: ['Google', 'Amazon', 'Microsoft'],
        });
      } else {
        const isMatch = await bcrypt.compare(password, user.passwordHash);
        if (!isMatch) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password.',
          });
        }
      }

      const token = generateToken(user);
      const { passwordHash: _, ...safeUser } = user;

      return res.json({
        success: true,
        message: 'Logged in successfully.',
        token,
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};
