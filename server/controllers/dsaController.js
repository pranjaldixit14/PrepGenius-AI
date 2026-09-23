import mongoose from 'mongoose';
import CodingQuestion from '../models/CodingQuestion.js';
import CodingProgress from '../models/CodingProgress.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getQuestions = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { difficulty, topic, search, status } = req.query;

    if (isDbConnected()) {
      const query = {};
      if (difficulty && difficulty !== 'All') query.difficulty = difficulty;
      if (topic && topic !== 'All') query.topics = topic;
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { statement: { $regex: search, $options: 'i' } },
        ];
      }

      const questions = await CodingQuestion.find(query).select('title slug difficulty topics');
      const progressDocs = await CodingProgress.find({ user: userId });

      const progressMap = new Map();
      progressDocs.forEach(p => progressMap.set(String(p.question), p));

      let enriched = questions.map(q => {
        const prog = progressMap.get(String(q._id));
        return {
          _id: q._id,
          title: q.title,
          slug: q.slug,
          difficulty: q.difficulty,
          topics: q.topics,
          status: prog ? prog.status : 'Not Started',
          isBookmarked: prog ? prog.isBookmarked : false,
          attempts: prog ? prog.attempts : 0,
        };
      });

      if (status && status !== 'All') {
        enriched = enriched.filter(q => q.status === status);
      }

      return res.json({
        success: true,
        count: enriched.length,
        questions: enriched,
      });
    } else {
      // Memory store
      const questions = memoryStore.getCodingQuestions({ difficulty, topic, search });
      const userProgress = memoryStore.getUserCodingProgress(userId);

      const progressMap = new Map();
      userProgress.forEach(p => progressMap.set(String(p.question), p));

      let enriched = questions.map(q => {
        const prog = progressMap.get(String(q._id));
        return {
          _id: q._id,
          title: q.title,
          slug: q.slug,
          difficulty: q.difficulty,
          topics: q.topics,
          status: prog ? prog.status : 'Not Started',
          isBookmarked: prog ? prog.isBookmarked : false,
          attempts: prog ? prog.attempts : 0,
        };
      });

      if (status && status !== 'All') {
        enriched = enriched.filter(q => q.status === status);
      }

      return res.json({
        success: true,
        count: enriched.length,
        questions: enriched,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getQuestionDetail = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { identifier } = req.params; // Can be slug or ID

    let question = null;
    if (isDbConnected()) {
      if (mongoose.Types.ObjectId.isValid(identifier)) {
        question = await CodingQuestion.findById(identifier);
      }
      if (!question) {
        question = await CodingQuestion.findOne({ slug: identifier });
      }
    } else {
      question = memoryStore.getCodingQuestionByIdOrSlug(identifier);
    }

    if (!question) {
      return res.status(404).json({ success: false, message: 'Question not found' });
    }

    // Get user progress for this question
    let progress = null;
    if (isDbConnected()) {
      progress = await CodingProgress.findOne({ user: userId, question: question._id });
    } else {
      const allProg = memoryStore.getUserCodingProgress(userId);
      progress = allProg.find(p => String(p.question) === String(question._id)) || null;
    }

    return res.json({
      success: true,
      question,
      progress: progress || {
        status: 'Not Started',
        isBookmarked: false,
        attempts: 0,
        lastSubmittedCode: '',
      },
    });
  } catch (error) {
    next(error);
  }
};

export const updateProgress = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { questionId, status, isBookmarked, code, language } = req.body;

    if (!questionId) {
      return res.status(400).json({ success: false, message: 'Question ID is required.' });
    }

    const updates = {};
    if (status) updates.status = status;
    if (typeof isBookmarked === 'boolean') updates.isBookmarked = isBookmarked;
    if (code !== undefined) updates.lastSubmittedCode = code;
    if (language) updates.lastLanguage = language;
    if (status === 'Solved') updates.solvedAt = new Date();

    if (isDbConnected()) {
      const progress = await CodingProgress.findOneAndUpdate(
        { user: userId, question: questionId },
        {
          $set: updates,
          $inc: { attempts: 1 },
        },
        { new: true, upsert: true }
      );

      return res.json({
        success: true,
        message: status === 'Solved' ? 'Great job! Problem marked as solved.' : 'Progress updated.',
        progress,
      });
    } else {
      const progress = memoryStore.saveCodingProgress(userId, questionId, updates);
      return res.json({
        success: true,
        message: status === 'Solved' ? 'Great job! Problem marked as solved.' : 'Progress updated.',
        progress,
      });
    }
  } catch (error) {
    next(error);
  }
};
