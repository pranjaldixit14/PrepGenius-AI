import mongoose from 'mongoose';

const evaluationSchema = new mongoose.Schema({
  technicalCorrectness: { type: Number, min: 0, max: 100 },
  relevance: { type: Number, min: 0, max: 100 },
  clarityAndStructure: { type: Number, min: 0, max: 100 },
  completeness: { type: Number, min: 0, max: 100 },
  communicationQuality: { type: Number, min: 0, max: 100 },
  feedback: { type: String, default: '' },
  actionableImprovement: { type: String, default: '' },
  score: { type: Number, min: 0, max: 100 },
}, { _id: false });

const interviewTurnSchema = new mongoose.Schema({
  questionIndex: Number,
  question: { type: String, required: true },
  category: { type: String, default: 'Technical' },
  userAnswer: { type: String, default: '' },
  evaluation: evaluationSchema,
  answeredAt: Date,
}, { _id: false });

const interviewSessionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    role: {
      type: String,
      required: true,
      default: 'Software Engineer',
    },
    type: {
      type: String,
      enum: ['Technical', 'Behavioral', 'Mixed'],
      default: 'Mixed',
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium',
    },
    experienceLevel: {
      type: String,
      default: 'Fresher',
    },
    totalQuestions: {
      type: Number,
      default: 5,
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
    },
    currentQuestionIndex: {
      type: Number,
      default: 0,
    },
    turns: [interviewTurnSchema],
    overallScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    strengths: {
      type: [String],
      default: [],
    },
    weaknesses: {
      type: [String],
      default: [],
    },
    recommendations: {
      type: [String],
      default: [],
    },
    summaryNotes: {
      type: String,
      default: '',
    },
    completedAt: Date,
  },
  { timestamps: true }
);

const InterviewSession = mongoose.models.InterviewSession || mongoose.model('InterviewSession', interviewSessionSchema);
export default InterviewSession;
