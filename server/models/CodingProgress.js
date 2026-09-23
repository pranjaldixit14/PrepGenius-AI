import mongoose from 'mongoose';

const codingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CodingQuestion',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['Not Started', 'Attempted', 'Solved'],
      default: 'Not Started',
    },
    isBookmarked: {
      type: Boolean,
      default: false,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    lastSubmittedCode: {
      type: String,
      default: '',
    },
    lastLanguage: {
      type: String,
      default: 'javascript',
    },
    solvedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

// Compound index for fast lookup per user per question
codingProgressSchema.index({ user: 1, question: 1 }, { unique: true });

const CodingProgress = mongoose.models.CodingProgress || mongoose.model('CodingProgress', codingProgressSchema);
export default CodingProgress;
