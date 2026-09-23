import mongoose from 'mongoose';
import AptitudeQuestion from '../models/AptitudeQuestion.js';
import AptitudeAttempt from '../models/AptitudeAttempt.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

const normalizeCategory = (cat) => {
  if (!cat || cat === 'Mixed' || cat === 'All') return null;
  const lower = cat.toLowerCase().trim();
  if (lower.startsWith('quant')) return 'Quantitative';
  if (lower.startsWith('logic')) return 'Logical reasoning';
  if (lower.startsWith('verbal') || lower.startsWith('english')) return 'Verbal ability';
  if (lower.includes('core') || lower.includes('cs') || lower.includes('tech')) return 'Core CS';
  return cat;
};

export const getQuestions = async (req, res, next) => {
  try {
    const { category, difficulty, count = 10 } = req.query;
    const limit = Math.min(25, Math.max(3, parseInt(count) || 10));
    const normalizedCategory = normalizeCategory(category);

    if (isDbConnected()) {
      const match = {};
      if (normalizedCategory) match.category = normalizedCategory;
      if (difficulty && difficulty !== 'Mixed' && difficulty !== 'All') match.difficulty = difficulty;

      let questions = await AptitudeQuestion.aggregate([
        { $match: match },
        { $sample: { size: limit } },
        {
          $project: {
            category: 1,
            difficulty: 1,
            topic: 1,
            question: 1,
            options: 1,
            // Exclude correctAnswer and explanation during test mode to prevent cheating
          }
        }
      ]);

      // Fallback 1: If no questions found with specific difficulty, relax difficulty filter
      if (questions.length === 0 && match.difficulty) {
        const relaxedMatch = {};
        if (normalizedCategory) relaxedMatch.category = normalizedCategory;
        questions = await AptitudeQuestion.aggregate([
          { $match: relaxedMatch },
          { $sample: { size: limit } },
          {
            $project: {
              category: 1,
              difficulty: 1,
              topic: 1,
              question: 1,
              options: 1,
            }
          }
        ]);
      }

      // Fallback 2: If still no questions (e.g. database has few entries), get any available questions
      if (questions.length === 0) {
        questions = await AptitudeQuestion.aggregate([
          { $sample: { size: limit } },
          {
            $project: {
              category: 1,
              difficulty: 1,
              topic: 1,
              question: 1,
              options: 1,
            }
          }
        ]);
      }

      return res.json({
        success: true,
        count: questions.length,
        questions,
      });
    } else {
      const questions = memoryStore.getAptitudeQuestions(normalizedCategory || category, difficulty, limit);
      const safeQuestions = questions.map(({ correctAnswer: _, explanation: __, ...rest }) => rest);

      return res.json({
        success: true,
        count: safeQuestions.length,
        questions: safeQuestions,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const submitAttempt = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { category = 'Mixed', difficulty = 'Mixed', timeTaken = 0, submissions = [] } = req.body;

    if (!Array.isArray(submissions) || submissions.length === 0) {
      return res.status(400).json({ success: false, message: 'No answers submitted.' });
    }

    let questionIds = submissions.map(s => s.questionId);
    let originalQuestions = [];

    if (isDbConnected()) {
      originalQuestions = await AptitudeQuestion.find({ _id: { $in: questionIds } });
    } else {
      originalQuestions = memoryStore.aptitudeQuestions.filter(q => questionIds.includes(String(q._id)));
    }

    const questionMap = new Map();
    originalQuestions.forEach(q => questionMap.set(String(q._id), q));

    let correctCount = 0;
    let incorrectCount = 0;
    let skippedCount = 0;

    const topicStats = {};
    const detailedAnswers = [];

    submissions.forEach(sub => {
      const q = questionMap.get(String(sub.questionId));
      if (!q) return;

      const isSkipped = sub.selectedOption === undefined || sub.selectedOption === null || sub.selectedOption === -1;
      const isCorrect = !isSkipped && sub.selectedOption === q.correctAnswer;

      if (isSkipped) skippedCount++;
      else if (isCorrect) correctCount++;
      else incorrectCount++;

      // Track topic performance
      if (!topicStats[q.topic]) {
        topicStats[q.topic] = { total: 0, correct: 0 };
      }
      topicStats[q.topic].total += 1;
      if (isCorrect) topicStats[q.topic].correct += 1;

      detailedAnswers.push({
        questionId: q._id,
        questionText: q.question,
        topic: q.topic,
        category: q.category,
        selectedOption: sub.selectedOption ?? -1,
        correctOption: q.correctAnswer,
        isCorrect,
        explanation: q.explanation,
      });
    });

    const totalQuestions = detailedAnswers.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    // Score calculation: +4 for correct, -1 for incorrect, 0 for skipped
    const score = Math.max(0, (correctCount * 4) - (incorrectCount * 1));

    const topicBreakdown = Object.keys(topicStats).map(topic => ({
      topic,
      total: topicStats[topic].total,
      correct: topicStats[topic].correct,
      accuracy: Math.round((topicStats[topic].correct / topicStats[topic].total) * 100),
    }));

    const attemptData = {
      user: userId,
      category,
      difficulty,
      totalQuestions,
      correctCount,
      incorrectCount,
      skippedCount,
      score,
      accuracy,
      timeTaken,
      topicBreakdown,
      answers: detailedAnswers,
    };

    let savedAttempt;
    if (isDbConnected()) {
      savedAttempt = await AptitudeAttempt.create(attemptData);
    } else {
      savedAttempt = memoryStore.saveAptitudeAttempt(attemptData);
    }

    return res.status(201).json({
      success: true,
      message: 'Test submitted and graded successfully.',
      attempt: savedAttempt,
    });
  } catch (error) {
    next(error);
  }
};

export const getAttempts = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      const attempts = await AptitudeAttempt.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('-answers');
      return res.json({ success: true, count: attempts.length, attempts });
    } else {
      const attempts = memoryStore.getUserAptitudeAttempts(userId).map(({ answers: _, ...rest }) => rest);
      return res.json({ success: true, count: attempts.length, attempts });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAttempt = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    if (isDbConnected()) {
      const deleted = await AptitudeAttempt.findOneAndDelete({ _id: id, user: userId });
      if (!deleted) {
        return res.status(404).json({ success: false, message: 'Attempt not found or unauthorized.' });
      }
    } else {
      memoryStore.deleteAptitudeAttempt(id, userId);
    }

    return res.json({
      success: true,
      message: 'Attempt removed successfully.',
    });
  } catch (error) {
    next(error);
  }
};

export const clearAllAttempts = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      await AptitudeAttempt.deleteMany({ user: userId });
    } else {
      memoryStore.clearUserAptitudeAttempts(userId);
    }

    return res.json({
      success: true,
      message: 'All past test attempts have been cleared successfully.',
    });
  } catch (error) {
    next(error);
  }
};

