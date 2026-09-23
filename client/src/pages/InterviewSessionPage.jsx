import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MessageSquareCode,
  Sparkles,
  Send,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Award,
  Clock,
  RotateCcw,
  Bot
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { interviewService } from '../services/interviewService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';

export const InterviewSessionPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [answer, setAnswer] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [latestEvaluation, setLatestEvaluation] = useState(null);

  useEffect(() => {
    fetchSession();
  }, [id]);

  const fetchSession = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getSession(id);
      if (res?.success && res.session) {
        setSession(res.session);
        // If current turn already has evaluation, display it
        const currentTurn = res.session.turns?.[res.session.currentQuestionIndex];
        if (currentTurn?.evaluation) {
          setLatestEvaluation(currentTurn.evaluation);
        }
      }
    } catch (err) {
      console.error('Failed to load session:', err);
      showToast('Could not load interview session', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAnswer = async () => {
    if (!answer || answer.trim().length < 10) {
      showToast('Please provide a substantive answer before submitting (at least 10 characters).', 'warning');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await interviewService.submitAnswer(id, answer.trim());
      if (res?.success) {
        setSession(res.session);
        setLatestEvaluation(res.evaluation);
        setAnswer('');
        showToast('Answer evaluated by AI interviewer!', 'success');

        if (res.isCompleted) {
          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {}
        }
      }
    } catch (err) {
      console.error('Answer submission error:', err);
      showToast(err.message || 'Failed to submit answer', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skeleton className="h-14 rounded-2xl" />
        <Skeleton className="h-80 rounded-2xl" />
      </div>
    );
  }

  if (!session) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Interview session not found.</p>
        <Link to="/interview" className="mt-4 inline-block">
          <Button size="sm" variant="secondary">Back to Mock Interview Hub</Button>
        </Link>
      </div>
    );
  }

  // ==================== FINAL COMPLETED REPORT CARD VIEW ====================
  if (session.status === 'completed') {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
        {/* Report Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/95 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              <span>Interview Session Completed</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Performance Report Card
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
              Role: <span className="text-white font-semibold">{session.role}</span> • {session.type} ({session.difficulty})
            </p>
          </div>

          {/* Overall Score Radial */}
          <div className="flex items-center gap-4 bg-[#10172a] p-5 rounded-2xl border border-white/10 shrink-0 shadow-md">
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-700/60"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000"
                  strokeDasharray={`${session.overallScore}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-black text-white">{session.overallScore}</span>
                <span className="block text-[9px] text-slate-400 uppercase">Score</span>
              </div>
            </div>
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Overall Rating</span>
              <p className="text-sm font-extrabold text-cyan-300 mt-0.5">
                {session.overallScore >= 80 ? 'Highly Recommend' : session.overallScore >= 65 ? 'Competitive' : 'Developing'}
              </p>
              <p className="text-[11px] text-slate-400 mt-1">{session.turns?.length} questions evaluated</p>
            </div>
          </div>
        </div>

        {/* Executive Summary */}
        {session.summaryNotes && (
          <Card className="p-6">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">Executive Evaluation</h3>
            <p className="text-sm text-slate-200 leading-relaxed">{session.summaryNotes}</p>
          </Card>
        )}

        {/* Strengths & Weaknesses Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <CheckCircle2 className="w-5 h-5 text-cyan-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Demonstrated Strengths</h4>
            </div>
            <ul className="space-y-2.5">
              {session.strengths?.map((s, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="text-cyan-400 font-bold">✓</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Improvement Areas</h4>
            </div>
            <ul className="space-y-2.5">
              {session.weaknesses?.map((w, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="text-amber-400 font-bold">▲</span>
                  <span>{w}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        {/* Strategic Recommendations */}
        {session.recommendations?.length > 0 && (
          <Card className="p-6 space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
              <Lightbulb className="w-5 h-5 text-purple-400" />
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Next Step Recommendations</h4>
            </div>
            <ul className="space-y-2.5">
              {session.recommendations.map((rec, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <span className="text-purple-400 font-bold">→</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </Card>
        )}

        {/* Transcript of Questions and Feedback */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">Question by Question Transcript</h3>
          <div className="space-y-3">
            {session.turns?.map((turn, idx) => (
              <Card key={idx} className="p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">Q{idx + 1}</span>
                    <Badge variant="purple" size="sm">{turn.category || 'Technical'}</Badge>
                  </div>
                  <span className="font-mono text-xs font-bold text-cyan-400">
                    {turn.evaluation?.score ?? 'N/A'}/100 Score
                  </span>
                </div>

                <p className="text-sm font-semibold text-white">{turn.question}</p>
                <div className="p-3 rounded-xl bg-[#10172a] border border-white/10 text-xs text-slate-200 space-y-1">
                  <span className="text-slate-400 font-bold block">Your Answer:</span>
                  <p className="italic">{turn.userAnswer || '[No response provided]'}</p>
                </div>

                {turn.evaluation?.feedback && (
                  <p className="text-xs text-slate-300 leading-relaxed">
                    <span className="text-purple-300 font-bold">Critique: </span>
                    {turn.evaluation.feedback}
                  </p>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/interview">
            <Button variant="secondary" size="md" icon={RotateCcw}>
              Start Another Interview
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Return to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ==================== LIVE ACTIVE QUESTION VIEW ====================
  const currentIndex = session.currentQuestionIndex || 0;
  const currentTurn = session.turns?.[currentIndex];
  const isTurnAlreadyAnswered = !!currentTurn?.userAnswer && !!currentTurn?.evaluation;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Session Top Bar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141b30]/95 border border-white/10 shadow-lg">
        <Link to="/interview" className="inline-flex items-center text-xs font-semibold text-slate-400 hover:text-white gap-1.5">
          <ArrowLeft className="w-4 h-4" />
          <span>Exit Session</span>
        </Link>

        <div className="flex items-center gap-2">
          <Badge variant="purple" size="sm">{session.role}</Badge>
          <span className="text-xs text-slate-300 font-medium">
            Question <span className="text-cyan-400 font-bold">{currentIndex + 1}</span> of {session.totalQuestions}
          </span>
        </div>
      </div>

      {/* Interviewer Question Card */}
      <Card className="p-6 sm:p-8 space-y-4 border border-purple-500/30 bg-[#141b30]/95 backdrop-blur-xl shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-purple-950/80 text-purple-300 border border-purple-500/40 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-white block">AI Technical Interviewer</span>
              <span className="text-[11px] text-cyan-300 font-medium">{currentTurn?.category || session.type} Focus</span>
            </div>
          </div>
          <Badge variant="slate" size="sm">Turn {currentIndex + 1}</Badge>
        </div>

        <div className="text-base sm:text-lg font-medium text-white leading-relaxed pt-2">
          {currentTurn?.question}
        </div>
      </Card>

      {/* Answer Workspace */}
      {!isTurnAlreadyAnswered ? (
        <Card className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-200 uppercase tracking-wider">
              Your Answer
            </label>
            <span className="text-xs text-slate-400 font-mono">
              {answer.trim().split(/\s+/).filter(Boolean).length} words
            </span>
          </div>

          <textarea
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            rows={7}
            placeholder="Structure your thoughts clearly. Explain your approach, core algorithm, system trade-offs, or use the STAR method for behavioral questions..."
            className="w-full p-4 bg-[#10172a] border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-colors leading-relaxed resize-y"
          />

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
            <p className="text-[11px] text-slate-400">
              Tip: Structured communication and real-world trade-offs score highest.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={Send}
              isLoading={isSubmitting}
              onClick={handleSubmitAnswer}
            >
              Submit Answer for Evaluation
            </Button>
          </div>
        </Card>
      ) : (
        /* Evaluation Card for Answered Turn */
        <div className="space-y-4 animate-in fade-in duration-300">
          <Card className="p-6 space-y-4 border-purple-500/30">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-cyan-400" />
                <h4 className="text-sm font-bold text-white">Answer Evaluation</h4>
              </div>
              <span className="text-base font-black text-cyan-300 font-mono">
                {currentTurn.evaluation?.score}/100 Score
              </span>
            </div>

            {/* Dimensional Bars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Technical Correctness</span>
                  <span className="text-white font-mono font-medium">{currentTurn.evaluation?.technicalCorrectness}%</span>
                </div>
                <ProgressBar value={currentTurn.evaluation?.technicalCorrectness || 70} color="purple" size="sm" showPercentage={false} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Relevance to Question</span>
                  <span className="text-white font-mono font-medium">{currentTurn.evaluation?.relevance}%</span>
                </div>
                <ProgressBar value={currentTurn.evaluation?.relevance || 75} color="cyan" size="sm" showPercentage={false} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Clarity & Structure</span>
                  <span className="text-white font-mono font-medium">{currentTurn.evaluation?.clarityAndStructure}%</span>
                </div>
                <ProgressBar value={currentTurn.evaluation?.clarityAndStructure || 70} color="purple" size="sm" showPercentage={false} />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Completeness</span>
                  <span className="text-white font-mono font-medium">{currentTurn.evaluation?.completeness}%</span>
                </div>
                <ProgressBar value={currentTurn.evaluation?.completeness || 65} color="cyan" size="sm" showPercentage={false} />
              </div>
            </div>

            {/* Constructive critique */}
            <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-slate-200 space-y-1">
              <span className="text-purple-300 font-bold block">Interviewer Feedback:</span>
              <p className="leading-relaxed text-slate-200">{currentTurn.evaluation?.feedback}</p>
            </div>

            {currentTurn.evaluation?.actionableImprovement && (
              <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs text-amber-200 space-y-1">
                <span className="text-amber-300 font-bold block">Actionable Refinement Tip:</span>
                <p className="leading-relaxed text-amber-200">{currentTurn.evaluation.actionableImprovement}</p>
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
};
