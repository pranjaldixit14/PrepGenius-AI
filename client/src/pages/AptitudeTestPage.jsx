import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  Send,
  Sparkles,
  BookOpen,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { aptitudeService } from '../services/aptitudeService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';

export const AptitudeTestPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const category = searchParams.get('category') || 'Mixed';
  const count = parseInt(searchParams.get('count') || '5', 10);
  const difficulty = searchParams.get('difficulty') || 'Mixed';

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { questionId: selectedIndex }
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(count * 90); // 90 seconds per question
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [testResult, setTestResult] = useState(null);

  const timerRef = useRef(null);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    fetchQuestions();
    return () => clearInterval(timerRef.current);
  }, []);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      let res = await aptitudeService.getQuestions({ category, count, difficulty });
      if (!res?.questions || res.questions.length === 0) {
        // Fallback 1: Relax difficulty to mixed
        res = await aptitudeService.getQuestions({ category, count, difficulty: 'Mixed' });
      }
      if (!res?.questions || res.questions.length === 0) {
        // Fallback 2: Mixed categories so user test is never blank
        res = await aptitudeService.getQuestions({ count, difficulty: 'Mixed' });
      }
      if (res?.success && res.questions?.length > 0) {
        setQuestions(res.questions);
        startTimer(res.questions.length * 90);
      } else {
        showToast('No questions found for this test configuration', 'warning');
      }
    } catch (err) {
      console.error('Failed to load questions:', err);
      showToast('Error loading test questions', 'error');
    } finally {
      setLoading(false);
    }
  };

  const startTimer = (initialSeconds) => {
    setTimeRemaining(initialSeconds);
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSelectOption = (qId, optionIdx) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [qId]: optionIdx,
    }));
  };

  const handleClearOption = (qId) => {
    setSelectedAnswers((prev) => {
      const copy = { ...prev };
      delete copy[qId];
      return copy;
    });
  };

  const handleToggleReview = (qId) => {
    setMarkedForReview((prev) => {
      const next = new Set(prev);
      if (next.has(qId)) next.delete(qId);
      else next.add(qId);
      return next;
    });
  };

  const handleAutoSubmit = () => {
    showToast('Time expired! Submitting your answers...', 'info');
    handleSubmitTest();
  };

  const handleSubmitTest = async () => {
    setIsSubmitModalOpen(false);
    clearInterval(timerRef.current);
    setSubmitting(true);

    const timeTaken = Math.round((Date.now() - startTimeRef.current) / 1000);

    const submissions = questions.map((q) => ({
      questionId: q._id || q.id,
      selectedOption: selectedAnswers[q._id || q.id] ?? -1,
    }));

    try {
      const res = await aptitudeService.submitAttempt({
        category,
        difficulty,
        timeTaken,
        submissions,
      });

      if (res?.success && res.attempt) {
        setTestResult(res.attempt);
        showToast('Test evaluated successfully!', 'success');

        if (res.attempt.accuracy >= 70) {
          try {
            confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }
      }
    } catch (err) {
      console.error('Submission error:', err);
      showToast(err.message || 'Failed to submit test', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        <Skeleton className="h-16 rounded-2xl" />
        <Skeleton className="h-96 rounded-2xl" />
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="max-w-md mx-auto my-16 p-8 rounded-3xl border border-white/10 bg-[#141b30] text-center space-y-4 shadow-xl">
        <AlertTriangle className="w-12 h-12 text-amber-400 mx-auto" />
        <h3 className="text-lg font-bold text-white">Questions Unavailable</h3>
        <p className="text-xs text-slate-300">
          We could not load questions for "{category}". Click below to try again or return to the Aptitude Hub.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Button size="sm" variant="secondary" onClick={fetchQuestions}>
            Try Again
          </Button>
          <Link to="/aptitude">
            <Button size="sm" variant="primary">
              Back to Aptitude Hub
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ==================== TEST RESULTS VIEW ====================
  if (testResult) {
    return (
      <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-300">
        {/* Results Banner */}
        <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/90 backdrop-blur-xl shadow-2xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-3">
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Test Graded & Saved</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Assessment Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Category: <span className="text-cyan-400 font-semibold">{testResult.category}</span> • Difficulty: <span className="text-slate-200">{testResult.difficulty}</span>
          </p>

          {/* Core Score Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 max-w-2xl mx-auto">
            <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 shadow-lg">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Accuracy</span>
              <span className="text-2xl font-bold text-emerald-400 mt-1 block">{testResult.accuracy}%</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 shadow-lg">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Correct</span>
              <span className="text-2xl font-bold text-cyan-400 mt-1 block">{testResult.correctCount} / {testResult.totalQuestions}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 shadow-lg">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Score</span>
              <span className="text-2xl font-bold text-white mt-1 block">{testResult.score} pts</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 shadow-lg">
              <span className="text-[11px] text-slate-400 block uppercase font-medium">Time Taken</span>
              <span className="text-2xl font-bold text-purple-400 mt-1 block font-mono">
                {Math.floor(testResult.timeTaken / 60)}m {testResult.timeTaken % 60}s
              </span>
            </div>
          </div>
        </div>

        {/* Topic Breakdown */}
        {testResult.topicBreakdown?.length > 0 && (
          <Card className="p-6 space-y-4 bg-[#141b30]/90 border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Topic Breakdown & Accuracy
            </h3>
            <div className="space-y-3">
              {testResult.topicBreakdown.map((tb, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-200 font-medium">{tb.topic}</span>
                    <span className="text-slate-400 font-mono">{tb.correct} / {tb.total} ({tb.accuracy}%)</span>
                  </div>
                  <ProgressBar
                    value={tb.accuracy}
                    max={100}
                    color={tb.accuracy >= 70 ? 'emerald' : tb.accuracy >= 40 ? 'amber' : 'rose'}
                    size="sm"
                    showPercentage={false}
                  />
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Detailed Question Review Accordion */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            Detailed Solution Review
          </h3>

          <div className="space-y-3">
            {testResult.answers?.map((ans, idx) => (
              <Card key={idx} className="p-5 space-y-3 bg-[#141b30]/90 border-white/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-slate-400">#{idx + 1}</span>
                    <Badge variant={ans.isCorrect ? 'emerald' : ans.selectedOption === -1 ? 'slate' : 'rose'} size="sm">
                      {ans.isCorrect ? 'Correct (+4)' : ans.selectedOption === -1 ? 'Skipped (0)' : 'Incorrect (-1)'}
                    </Badge>
                    <span className="text-xs text-slate-400 font-medium">{ans.topic}</span>
                  </div>
                </div>

                <p className="text-sm font-medium text-slate-100">{ans.questionText}</p>

                {ans.explanation && (
                  <div className="p-3.5 rounded-xl bg-[#10172a] border border-white/10 text-xs text-slate-200 space-y-1">
                    <span className="text-cyan-400 font-bold block">Explanation:</span>
                    <p className="leading-relaxed text-slate-300">{ans.explanation}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-4 pt-4">
          <Link to="/aptitude">
            <Button variant="secondary" size="md" icon={RotateCcw}>
              Practice Another Topic
            </Button>
          </Link>
          <Link to="/dashboard">
            <Button variant="primary" size="md" icon={ArrowRight}>
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // ==================== ACTIVE TEST VIEW ====================
  const currentQ = questions[currentIndex];
  const qId = currentQ._id || currentQ.id;
  const answeredCount = Object.keys(selectedAnswers).length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Test Runner Topbar */}
      <div className="flex items-center justify-between p-4 rounded-2xl bg-[#141b30]/95 border border-white/10 shadow-2xl backdrop-blur-md sticky top-20 z-20">
        <div className="flex items-center gap-3">
          <Badge variant="purple" size="sm">{category}</Badge>
          <span className="text-xs text-slate-300 font-medium">
            Question <span className="text-white font-bold">{currentIndex + 1}</span> of {questions.length}
          </span>
        </div>

        {/* Timer */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl font-mono text-xs font-bold border ${
          timeRemaining < 120
            ? 'bg-rose-950/60 border-rose-500/50 text-rose-300 animate-pulse'
            : 'bg-[#10172a] border-white/10 text-cyan-400'
        }`}>
          <Clock className="w-3.5 h-3.5" />
          <span>{formatTime(timeRemaining)}</span>
        </div>

        <Button
          size="sm"
          variant="primary"
          icon={Send}
          onClick={() => setIsSubmitModalOpen(true)}
        >
          Finish Test
        </Button>
      </div>

      {/* Main Question Card */}
      <Card className="p-6 sm:p-8 space-y-6 bg-[#141b30]/90 border-white/10">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <Badge variant="cyan" size="sm">{currentQ.topic || 'General'}</Badge>
            <button
              onClick={() => handleToggleReview(qId)}
              className={`text-xs font-semibold px-2.5 py-1 rounded-lg border transition-colors ${
                markedForReview.has(qId)
                  ? 'bg-amber-500/20 border-amber-400/50 text-amber-300 shadow-xs'
                  : 'text-slate-300 border-white/10 hover:text-white hover:bg-white/5'
              }`}
            >
              {markedForReview.has(qId) ? '★ Marked for Review' : '☆ Mark for Review'}
            </button>
          </div>

          <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
            {currentQ.question}
          </h3>
        </div>

        {/* Options */}
        <div className="space-y-3 pt-2">
          {currentQ.options?.map((opt, optIdx) => {
            const isSelected = selectedAnswers[qId] === optIdx;
            const optionLabels = ['A', 'B', 'C', 'D', 'E'];

            return (
              <button
                key={optIdx}
                type="button"
                onClick={() => handleSelectOption(qId, optIdx)}
                className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center gap-3.5 ${
                  isSelected
                    ? 'bg-purple-950/80 border-purple-500 text-white shadow-lg ring-1 ring-purple-500/40'
                    : 'bg-[#10172a] border-white/10 hover:border-purple-400/50 hover:bg-[#162038] text-slate-200'
                }`}
              >
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center font-bold font-mono text-xs shrink-0 ${
                  isSelected
                    ? 'bg-purple-600 text-white'
                    : 'bg-[#141b30] text-slate-300 border border-white/10'
                }`}>
                  {optionLabels[optIdx] || optIdx + 1}
                </span>
                <span className="flex-1 leading-snug">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation & Controls */}
        <div className="pt-6 border-t border-white/10 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="secondary"
              icon={ArrowLeft}
              disabled={currentIndex === 0}
              onClick={() => setCurrentIndex((prev) => prev - 1)}
            >
              Previous
            </Button>
            {selectedAnswers[qId] !== undefined && (
              <button
                type="button"
                onClick={() => handleClearOption(qId)}
                className="text-xs text-slate-400 hover:text-slate-200 px-2 py-1"
              >
                Clear choice
              </button>
            )}
          </div>

          <Button
            size="sm"
            variant="secondary"
            disabled={currentIndex === questions.length - 1}
            onClick={() => setCurrentIndex((prev) => prev + 1)}
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </Card>

      {/* Question Palette */}
      <Card className="p-4 bg-[#141b30]/90 border-white/10">
        <div className="flex items-center justify-between text-xs text-slate-300 mb-3 font-medium">
          <span>Question Palette</span>
          <span>{answeredCount} of {questions.length} Answered</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {questions.map((q, idx) => {
            const id = q._id || q.id;
            const isAnswered = selectedAnswers[id] !== undefined;
            const isReview = markedForReview.has(id);
            const isCurrent = currentIndex === idx;

            return (
              <button
                key={id}
                onClick={() => setCurrentIndex(idx)}
                className={`w-8 h-8 rounded-lg text-xs font-bold font-mono transition-all ${
                  isCurrent
                    ? 'ring-2 ring-purple-400 ring-offset-2 ring-offset-[#0d1322]'
                    : ''
                } ${
                  isAnswered
                    ? 'bg-purple-600 text-white'
                    : isReview
                    ? 'bg-amber-500 text-white'
                    : 'bg-[#10172a] text-slate-300 border border-white/10 hover:bg-[#18233d]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </Card>

      {/* Finish Confirmation Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Submit Aptitude Test?"
      >
        <div className="space-y-4 text-xs sm:text-sm text-slate-300">
          <p>
            You have answered <span className="font-bold text-white">{answeredCount}</span> of{' '}
            <span className="font-bold text-white">{questions.length}</span> questions.
          </p>
          {questions.length - answeredCount > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/30 text-amber-300 text-xs">
              Note: {questions.length - answeredCount} unanswered questions will be marked as skipped.
            </div>
          )}

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsSubmitModalOpen(false)}>
              Resume Test
            </Button>
            <Button
              variant="primary"
              size="sm"
              isLoading={submitting}
              icon={Send}
              onClick={handleSubmitTest}
            >
              Confirm & Grade
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
