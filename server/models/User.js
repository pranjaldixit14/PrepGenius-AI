import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: [true, 'Password is required'],
    },
    targetRole: {
      type: String,
      default: 'Software Engineer',
      trim: true,
    },
    experienceLevel: {
      type: String,
      enum: ['Student', 'Fresher', 'Entry level', '1-2 years', 'Experienced'],
      default: 'Fresher',
    },
    college: {
      type: String,
      default: '',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    preferredCompanies: {
      type: [String],
      default: [],
    },
    preparationGoals: {
      type: String,
      default: 'Prepare for campus placements and technical software engineering interviews.',
    },
  },
  { timestamps: true }
);

// Method to verify password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.passwordHash);
};

// Static helper to hash passwords
userSchema.statics.hashPassword = async function (password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
