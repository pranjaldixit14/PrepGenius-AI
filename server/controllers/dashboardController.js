import mongoose from 'mongoose';
import Resume from '../models/Resume.js';
import CodingQuestion from '../models/CodingQuestion.js';
import CodingProgress from '../models/CodingProgress.js';
import AptitudeAttempt from '../models/AptitudeAttempt.js';
import InterviewSession from '../models/InterviewSession.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const getDashboardData = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const targetRole = req.user.targetRole || 'Software Engineer';
    const userName = req.user.name || 'Candidate';

    let latestResume = null;
    let resumeCount = 0;
    let totalQuestionsCount = 0;
    let solvedQuestionsCount = 0;
    let codingProgressList = [];
    let aptitudeAttempts = [];
    let interviewSessions = [];

    if (isDbConnected()) {
      latestResume = await Resume.findOne({ user: userId }).sort({ createdAt: -1 });
      resumeCount = await Resume.countDocuments({ user: userId });
      totalQuestionsCount = await CodingQuestion.countDocuments();
      solvedQuestionsCount = await CodingProgress.countDocuments({ user: userId, status: 'Solved' });
      codingProgressList = await CodingProgress.find({ user: userId }).populate('question', 'title difficulty topics');
      aptitudeAttempts = await AptitudeAttempt.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
      interviewSessions = await InterviewSession.find({ user: userId }).sort({ createdAt: -1 }).limit(10);
    } else {
      const userResumes = memoryStore.getUserResumes(userId);
      latestResume = userResumes[0] || null;
      resumeCount = userResumes.length;
      totalQuestionsCount = memoryStore.codingQuestions.length;
      const userProgress = memoryStore.getUserCodingProgress(userId);
      solvedQuestionsCount = userProgress.filter(p => p.status === 'Solved').length;
      codingProgressList = userProgress.map(p => {
        const q = memoryStore.getCodingQuestionByIdOrSlug(p.question);
        return { ...p, question: q };
      });
      aptitudeAttempts = memoryStore.getUserAptitudeAttempts(userId).slice(0, 10);
      interviewSessions = memoryStore.getUserInterviewSessions(userId).slice(0, 10);
    }

    // 1. Resume Score
    const resumeScore = latestResume ? latestResume.atsScore : 0;
    const resumeLastAnalyzed = latestResume ? latestResume.createdAt : null;

    // 2. DSA Progress
    const dsaSolved = solvedQuestionsCount;
    const dsaTotal = totalQuestionsCount || 10;
    const dsaPercentage = Math.round((dsaSolved / (dsaTotal || 1)) * 100);

    // 3. Aptitude Performance
    const avgAptitudeAccuracy = aptitudeAttempts.length > 0
      ? Math.round(aptitudeAttempts.reduce((acc, a) => acc + (a.accuracy || 0), 0) / aptitudeAttempts.length)
      : 0;
    const latestAptitudeAttempt = aptitudeAttempts[0] || null;

    // 4. Interview Performance
    const completedInterviews = interviewSessions.filter(s => s.status === 'completed');
    const avgInterviewScore = completedInterviews.length > 0
      ? Math.round(completedInterviews.reduce((acc, s) => acc + (s.overallScore || 0), 0) / completedInterviews.length)
      : 0;

    // 5. Overall Platform Readiness (Weighted composite metric: Resume 25%, DSA 35%, Aptitude 20%, Interview 20%)
    let readinessComponents = 0;
    let totalWeight = 0;

    if (resumeScore > 0) {
      readinessComponents += resumeScore * 0.25;
      totalWeight += 0.25;
    }
    if (dsaSolved > 0) {
      const dsaWeightedScore = Math.min(100, Math.round((dsaSolved / Math.max(5, dsaTotal * 0.6)) * 100));
      readinessComponents += dsaWeightedScore * 0.35;
      totalWeight += 0.35;
    }
    if (avgAptitudeAccuracy > 0) {
      readinessComponents += avgAptitudeAccuracy * 0.20;
      totalWeight += 0.20;
    }
    if (avgInterviewScore > 0) {
      readinessComponents += avgInterviewScore * 0.20;
      totalWeight += 0.20;
    }

    const overallReadiness = totalWeight > 0 ? Math.round(readinessComponents / totalWeight) : 25;

    // Recommended next actions
    const recommendations = [];

    if (!latestResume) {
      recommendations.push({
        id: 'rec_resume',
        title: 'Upload Your Resume for AI ATS Evaluation',
        description: 'Get an instant baseline score, identify missing skills, and discover phrasing weaknesses.',
        category: 'Resume',
        actionUrl: '/resume',
        priority: 'High',
      });
    } else if (resumeScore < 70) {
      recommendations.push({
        id: 'rec_resume_improve',
        title: `Boost Resume Score (${resumeScore}/100)`,
        description: latestResume.suggestions?.[0] || 'Incorporate quantified impact metrics and target role keywords.',
        category: 'Resume',
        actionUrl: '/resume',
        priority: 'High',
      });
    }

    if (dsaSolved < 5) {
      recommendations.push({
        id: 'rec_dsa',
        title: 'Complete Core Algorithmic Questions',
        description: 'Build confidence with essential Two Pointers and Sliding Window patterns.',
        category: 'DSA',
        actionUrl: '/dsa',
        priority: 'High',
      });
    }

    if (aptitudeAttempts.length === 0) {
      recommendations.push({
        id: 'rec_apt',
        title: 'Attempt an Aptitude Benchmark Test',
        description: 'Take a 10-question timed speed test in Quantitative and Logical Reasoning.',
        category: 'Aptitude',
        actionUrl: '/aptitude',
        priority: 'Medium',
      });
    }

    if (completedInterviews.length === 0) {
      recommendations.push({
        id: 'rec_interview',
        title: 'Conduct Your First AI Mock Interview',
        description: `Simulate a real ${targetRole} technical round with immediate answer critique.`,
        category: 'Interview',
        actionUrl: '/interview',
        priority: 'Medium',
      });
    }

    // Recent activity aggregation
    const recentActivity = [];

    if (latestResume) {
      recentActivity.push({
        type: 'resume',
        title: `Analyzed Resume: ${latestResume.fileName}`,
        subtitle: `Scored ${latestResume.atsScore}/100 ATS readiness`,
        date: latestResume.createdAt,
        badge: `${latestResume.atsScore} pts`,
      });
    }

    codingProgressList
      .filter(p => p.status === 'Solved')
      .slice(0, 3)
      .forEach(p => {
        recentActivity.push({
          type: 'dsa',
          title: `Solved DSA Problem: ${p.question?.title || 'Problem'}`,
          subtitle: `Difficulty: ${p.question?.difficulty || 'Medium'}`,
          date: p.solvedAt || p.updatedAt || new Date(),
          badge: 'Solved',
        });
      });

    aptitudeAttempts.slice(0, 2).forEach(a => {
      recentActivity.push({
        type: 'aptitude',
        title: `Aptitude Practice: ${a.category}`,
        subtitle: `Accuracy: ${a.accuracy}% (${a.correctCount}/${a.totalQuestions} correct)`,
        date: a.createdAt,
        badge: `${a.accuracy}%`,
      });
    });

    interviewSessions.slice(0, 2).forEach(s => {
      recentActivity.push({
        type: 'interview',
        title: `Mock Interview: ${s.role}`,
        subtitle: s.status === 'completed' ? `Score: ${s.overallScore}/100` : 'In Progress',
        date: s.completedAt || s.createdAt,
        badge: s.status === 'completed' ? `${s.overallScore}/100` : 'Active',
      });
    });

    // Sort recent activity newest first
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    return res.json({
      success: true,
      data: {
        userName,
        targetRole,
        overallReadiness,
        cards: {
          resume: {
            score: resumeScore,
            lastAnalyzed: resumeLastAnalyzed,
            totalAnalyses: resumeCount,
          },
          dsa: {
            solved: dsaSolved,
            total: dsaTotal,
            percentage: dsaPercentage,
          },
          aptitude: {
            averageAccuracy: avgAptitudeAccuracy,
            totalAttempts: aptitudeAttempts.length,
            latestScore: latestAptitudeAttempt?.score || 0,
          },
          interview: {
            averageScore: avgInterviewScore,
            totalSessions: completedInterviews.length,
          },
        },
        recommendations,
        recentActivity: recentActivity.slice(0, 6),
      }
    });
  } catch (error) {
    next(error);
  }
};
