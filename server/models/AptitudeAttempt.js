import mongoose from 'mongoose';

const answerItemSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AptitudeQuestion',
  },
  questionText: String,
  topic: String,
  category: String,
  selectedOption: Number, // -1 if skipped
  correctOption: Number,
  isCorrect: Boolean,
  explanation: String,
}, { _id: false });

const aptitudeAttemptSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    category: {
      type: String,
      required: true,
    },
    difficulty: {
      type: String,
      default: 'Mixed',
    },
    totalQuestions: {
      type: Number,
      required: true,
    },
    correctCount: {
      type: Number,
      required: true,
    },
    incorrectCount: {
      type: Number,
      required: true,
    },
    skippedCount: {
      type: Number,
      default: 0,
    },
    score: {
      type: Number,
      required: true,
    },
    accuracy: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // in seconds
      required: true,
    },
    topicBreakdown: [
      {
        topic: String,
        total: Number,
        correct: Number,
        accuracy: Number,
      }
    ],
    answers: [answerItemSchema],
  },
  { timestamps: true }
);

const AptitudeAttempt = mongoose.models.AptitudeAttempt || mongoose.model('AptitudeAttempt', aptitudeAttemptSchema);
export default AptitudeAttempt;
