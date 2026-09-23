import mongoose from 'mongoose';
import InterviewSession from '../models/InterviewSession.js';
import { generateNextInterviewQuestion, evaluateCandidateAnswer, generateInterviewSummaryReport } from '../services/geminiService.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const createSession = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { role = 'Software Engineer', type = 'Mixed', difficulty = 'Medium', totalQuestions = 5 } = req.body;
    const experienceLevel = req.user.experienceLevel || 'Fresher';

    // Generate first question
    const firstQ = await generateNextInterviewQuestion({
      role,
      type,
      difficulty,
      experienceLevel,
      previousTurns: [],
      questionIndex: 0,
    });

    const initialTurns = [
      {
        questionIndex: 0,
        question: firstQ.question,
        category: firstQ.category,
        userAnswer: '',
      }
    ];

    const sessionData = {
      user: userId,
      role,
      type,
      difficulty,
      experienceLevel,
      totalQuestions: Math.min(15, Math.max(3, parseInt(totalQuestions) || 5)),
      status: 'in_progress',
      currentQuestionIndex: 0,
      turns: initialTurns,
      overallScore: 0,
      strengths: [],
      weaknesses: [],
      recommendations: [],
    };

    let session;
    if (isDbConnected()) {
      session = await InterviewSession.create(sessionData);
    } else {
      session = memoryStore.saveInterviewSession(sessionData);
    }

    return res.status(201).json({
      success: true,
      message: 'Interview session created.',
      session,
      currentQuestion: {
        index: 0,
        totalQuestions: session.totalQuestions,
        question: firstQ.question,
        category: firstQ.category,
      }
    });
  } catch (error) {
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { sessionId, answer } = req.body;

    if (!sessionId || !answer) {
      return res.status(400).json({ success: false, message: 'Session ID and answer are required.' });
    }

    let session;
    if (isDbConnected()) {
      session = await InterviewSession.findById(sessionId);
    } else {
      session = memoryStore.getInterviewSessionById(sessionId);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'Interview session not found.' });
    }

    // Ownership check
    const ownerId = String(session.user?._id || session.user);
    if (ownerId !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (session.status === 'completed') {
      return res.status(400).json({ success: false, message: 'This interview session is already completed.' });
    }

    const currentIndex = session.currentQuestionIndex;
    const currentTurn = session.turns[currentIndex];
    if (!currentTurn) {
      return res.status(400).json({ success: false, message: 'Invalid question turn index.' });
    }

    // 1. Evaluate candidate answer
    const evaluation = await evaluateCandidateAnswer({
      question: currentTurn.question,
      answer,
      role: session.role,
      difficulty: session.difficulty,
    });

    currentTurn.userAnswer = answer;
    currentTurn.evaluation = evaluation;
    currentTurn.answeredAt = new Date();

    const isLastQuestion = currentIndex + 1 >= session.totalQuestions;

    if (isLastQuestion) {
      // Finalize session & compute report card
      session.status = 'completed';
      session.completedAt = new Date();

      const summary = await generateInterviewSummaryReport({
        turns: session.turns,
        role: session.role,
        difficulty: session.difficulty,
      });

      session.overallScore = summary.overallScore;
      session.strengths = summary.strengths;
      session.weaknesses = summary.weaknesses;
      session.recommendations = summary.recommendations;
      session.summaryNotes = summary.summaryNotes;

      if (isDbConnected()) {
        await session.save();
      } else {
        memoryStore.saveInterviewSession(session);
      }

      return res.json({
        success: true,
        isCompleted: true,
        evaluation,
        summary,
        session,
      });
    } else {
      // Advance to next question
      session.currentQuestionIndex = currentIndex + 1;

      const nextQ = await generateNextInterviewQuestion({
        role: session.role,
        type: session.type,
        difficulty: session.difficulty,
        experienceLevel: session.experienceLevel,
        previousTurns: session.turns,
        questionIndex: session.currentQuestionIndex,
      });

      session.turns.push({
        questionIndex: session.currentQuestionIndex,
        question: nextQ.question,
        category: nextQ.category,
        userAnswer: '',
      });

      if (isDbConnected()) {
        await session.save();
      } else {
        memoryStore.saveInterviewSession(session);
      }

      return res.json({
        success: true,
        isCompleted: false,
        evaluation,
        nextQuestion: {
          index: session.currentQuestionIndex,
          totalQuestions: session.totalQuestions,
          question: nextQ.question,
          category: nextQ.category,
        },
        session,
      });
    }
  } catch (error) {
    next(error);
  }
};

export const getSession = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    let session;
    if (isDbConnected()) {
      session = await InterviewSession.findById(id);
    } else {
      session = memoryStore.getInterviewSessionById(id);
    }

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found.' });
    }

    const ownerId = String(session.user?._id || session.user);
    if (ownerId !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    return res.json({ success: true, session });
  } catch (error) {
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      const sessions = await InterviewSession.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('role type difficulty status overallScore createdAt completedAt totalQuestions turns');
      return res.json({ success: true, count: sessions.length, sessions });
    } else {
      const sessions = memoryStore.getUserInterviewSessions(userId);
      return res.json({ success: true, count: sessions.length, sessions });
    }
  } catch (error) {
    next(error);
  }
};
