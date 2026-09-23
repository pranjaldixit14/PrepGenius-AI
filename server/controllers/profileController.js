import mongoose from 'mongoose';
import User from '../models/User.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      const user = await User.findById(userId).select('-passwordHash');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
      return res.json({ success: true, user });
    } else {
      const user = memoryStore.findUserById(userId) || req.user;
      const { passwordHash: _, ...safeUser } = user;
      return res.json({ success: true, user: safeUser });
    }
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { name, targetRole, experienceLevel, college, skills, preferredCompanies, preparationGoals } = req.body;

    const updates = {};
    if (name) updates.name = name.trim();
    if (targetRole) updates.targetRole = targetRole.trim();
    if (experienceLevel) updates.experienceLevel = experienceLevel;
    if (college !== undefined) updates.college = college.trim();
    if (Array.isArray(skills)) updates.skills = skills;
    if (Array.isArray(preferredCompanies)) updates.preferredCompanies = preferredCompanies;
    if (preparationGoals !== undefined) updates.preparationGoals = preparationGoals.trim();

    if (isDbConnected()) {
      const updatedUser = await User.findByIdAndUpdate(userId, { $set: updates }, { new: true, runValidators: true }).select('-passwordHash');
      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: updatedUser,
      });
    } else {
      const user = memoryStore.findUserById(userId) || req.user;
      const updated = { ...user, ...updates };
      memoryStore.saveUser(updated);
      const { passwordHash: _, ...safeUser } = updated;
      return res.json({
        success: true,
        message: 'Profile updated successfully.',
        user: safeUser,
      });
    }
  } catch (error) {
    next(error);
  }
};
