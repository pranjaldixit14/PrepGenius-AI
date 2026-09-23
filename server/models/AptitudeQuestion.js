import mongoose from 'mongoose';

const aptitudeQuestionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['Quantitative', 'Logical reasoning', 'Verbal ability', 'Core CS'],
      required: true,
      index: true,
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    topic: {
      type: String,
      required: true,
    },
    question: {
      type: String,
      required: true,
    },
    options: {
      type: [String],
      required: true,
      validate: [val => val.length >= 2, 'Options array must have at least 2 items'],
    },
    correctAnswer: {
      type: Number, // 0-indexed option index
      required: true,
    },
    explanation: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const AptitudeQuestion = mongoose.models.AptitudeQuestion || mongoose.model('AptitudeQuestion', aptitudeQuestionSchema);
export default AptitudeQuestion;
