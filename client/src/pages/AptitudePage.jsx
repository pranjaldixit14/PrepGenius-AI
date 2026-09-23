import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BrainCircuit,
  Calculator,
  Compass,
  BookOpen,
  Cpu,
  Play,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  Sparkles,
  BarChart2,
  Trash2,
  AlertTriangle
} from 'lucide-react';
import { aptitudeService } from '../services/aptitudeService';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';

export const AptitudePage = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Configuration modal
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('Quantitative');
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState('Mixed');

  // Clear & delete attempt states
  const [isClearModalOpen, setIsClearModalOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [clearing, setClearing] = useState(false);

  useEffect(() => {
    fetchAttempts();
  }, []);

  const fetchAttempts = async () => {
    try {
      setLoading(true);
      const res = await aptitudeService.getAttempts();
      if (res?.success && res.attempts) {
        setAttempts(res.attempts);
      }
    } catch (err) {
      console.error('Failed to load attempts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAttempt = async (id) => {
    try {
      setDeletingId(id);
      const res = await aptitudeService.deleteAttempt(id);
      if (res?.success) {
        setAttempts((prev) => prev.filter((att) => (att._id || att.id) !== id));
        showToast('Attempt removed successfully', 'success');
      } else {
        showToast(res?.message || 'Failed to remove attempt', 'error');
      }
    } catch (err) {
      console.error('Failed to delete attempt:', err);
      showToast('Error removing attempt', 'error');
    } finally {
      setDeletingId(null);
    }
  };

  const handleClearAll = async () => {
    try {
      setClearing(true);
      const res = await aptitudeService.clearAllAttempts();
      if (res?.success) {
        setAttempts([]);
        setIsClearModalOpen(false);
        showToast('All past test attempts have been cleared', 'success');
      } else {
        showToast(res?.message || 'Failed to clear attempts', 'error');
      }
    } catch (err) {
      console.error('Failed to clear attempts:', err);
      showToast('Error clearing past attempts', 'error');
    } finally {
      setClearing(false);
    }
  };

  const handleStartTest = () => {
    setIsConfigOpen(false);
    navigate(`/aptitude/test?category=${encodeURIComponent(selectedCategory)}&count=${questionCount}&difficulty=${difficulty}`);
  };

  const categories = [
    {
      id: 'Quantitative',
      name: 'Quantitative Aptitude',
      shortName: 'Quantitative',
      icon: Calculator,
      color: 'cyan',
      topics: 'Percentages, Time & Work, Speed & Distance, Probability, CI/SI',
      description: 'Numerical calculation & problem solving common in TCS NQT, Infosys, Cognizant, and Amazon OA.',
    },
    {
      id: 'Logical reasoning',
      name: 'Logical Reasoning',
      shortName: 'Logical Reasoning',
      icon: Compass,
      color: 'blue',
      topics: 'Number Series, Blood Relations, Coding-Decoding, Syllogisms, Puzzles',
      description: 'Analytical deduction tests evaluating structured reasoning under strict time limits.',
    },
    {
      id: 'Verbal ability',
      name: 'Verbal Ability',
      shortName: 'Verbal Ability',
      icon: BookOpen,
      color: 'purple',
      topics: 'Grammar, Sentence Correction, Reading Comprehension, Synonyms',
      description: 'Language proficiency, error spotting, and comprehension critical for campus qualification.',
    },
    {
      id: 'Core CS',
      name: 'Core CS & Tech MCQs',
      shortName: 'Core CS & Tech MCQs',
      icon: Cpu,
      color: 'amber',
      topics: 'Operating Systems, DBMS & SQL, Computer Networks, OOP Concepts',
      description: 'Standard campus technical MCQ section asked in TCS Digital, Infosys SP/DSE, and Wipro Turbo.',
    },
    {
      id: 'Mixed',
      name: 'Mixed Practice Mock',
      shortName: 'Mixed Practice Mock',
      icon: BrainCircuit,
      color: 'emerald',
      topics: 'Balanced cross-domain simulated campus placement assessment',
      description: 'Simulate full-length multi-section aptitude rounds before actual drive day.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/95 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Placement Aptitude Accelerator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Aptitude Practice & Tests
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Timed speed assessments to build numerical speed, logical deduction, and verbal precision for campus placement drives.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Play}
          onClick={() => {
            setSelectedCategory('Mixed');
            setIsConfigOpen(true);
          }}
        >
          Quick Start Assessment
        </Button>
      </div>

      {/* Category Selection Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">
          Select Practice Category
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Card
                key={cat.id}
                hover
                onClick={() => {
                  setSelectedCategory(cat.id);
                  setIsConfigOpen(true);
                }}
                className="p-5 flex flex-col justify-between group"
              >
                <div>
                  <div className="p-3 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/30 w-fit mb-3 group-hover:scale-105 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {cat.name}
                  </h4>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                    {cat.description}
                  </p>
                  <p className="text-[11px] text-cyan-400 font-mono mt-3">
                    {cat.topics}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-xs font-semibold text-purple-300 group-hover:text-cyan-300">
                  <span>Configure Test</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Past Test Attempts */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Past Test Attempts</span>
          </h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">{attempts.length} completed</span>
            {attempts.length > 0 && (
              <button
                type="button"
                onClick={() => setIsClearModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-400 hover:text-rose-300 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            )}
          </div>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : attempts.length > 0 ? (
            <div className="divide-y divide-white/[0.06]">
              {attempts.map((att) => {
                const categoryName = categories.find((c) => c.id === att.category || c.name === att.category)?.name || att.category;
                const isDeleting = deletingId === (att._id || att.id);

                return (
                  <div
                    key={att._id || att.id}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/30">
                        <BarChart2 className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">{categoryName}</h4>
                          <Badge variant="slate" size="sm">{att.difficulty}</Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {new Date(att.createdAt).toLocaleDateString()} • Time spent: {Math.round(att.timeTaken / 60)}m {att.timeTaken % 60}s
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-5">
                      <div className="flex items-center gap-6 text-xs font-mono">
                        <div>
                          <span className="text-slate-400 block text-[10px]">CORRECT</span>
                          <span className="text-cyan-400 font-bold">{att.correctCount} / {att.totalQuestions}</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">ACCURACY</span>
                          <span className="text-fuchsia-400 font-bold">{att.accuracy}%</span>
                        </div>

                        <div>
                          <span className="text-slate-400 block text-[10px]">SCORE</span>
                          <span className="text-white font-bold">{att.score} pts</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteAttempt(att._id || att.id)}
                        disabled={isDeleting}
                        title="Delete attempt"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20 disabled:opacity-50 cursor-pointer"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No test attempts recorded yet. Click a category above to take a timed practice test.
            </div>
          )}
        </Card>
      </div>

      {/* Test Configuration Modal */}
      <Modal
        isOpen={isConfigOpen}
        onClose={() => setIsConfigOpen(false)}
        title="Configure Practice Test"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Category</label>
            <input
              type="text"
              readOnly
              value={categories.find(c => c.id === selectedCategory)?.name || selectedCategory}
              className="w-full bg-[#10172a] border border-white/15 rounded-xl px-3.5 py-2 text-white font-medium cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Number of Questions</label>
            <div className="grid grid-cols-3 gap-2">
              {[5, 10, 15].map((cnt) => (
                <button
                  key={cnt}
                  type="button"
                  onClick={() => setQuestionCount(cnt)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${
                    questionCount === cnt
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-transparent shadow-md'
                      : 'bg-[#10172a] text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {cnt} Questions
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Difficulty Level</label>
            <div className="grid grid-cols-4 gap-2">
              {['Mixed', 'Easy', 'Medium', 'Hard'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${
                    difficulty === diff
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-transparent shadow-md'
                      : 'bg-[#10172a] text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsConfigOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" icon={Play} onClick={handleStartTest}>
              Start Timed Test
            </Button>
          </div>
        </div>
      </Modal>

      {/* Clear All Attempts Confirmation Modal */}
      <Modal
        isOpen={isClearModalOpen}
        onClose={() => !clearing && setIsClearModalOpen(false)}
        title="Clear All Test Attempts"
      >
        <div className="space-y-4 text-xs">
          <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-start gap-3 text-rose-200">
            <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="font-bold text-rose-300 text-sm">Clear your entire test attempt history?</p>
              <p className="text-slate-300 text-xs leading-relaxed">
                This will permanently remove all <span className="text-white font-bold">{attempts.length}</span> recorded test attempt(s), including scored points, accuracy logs, and topic breakdowns.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsClearModalOpen(false)}
              disabled={clearing}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              icon={Trash2}
              onClick={handleClearAll}
              isLoading={clearing}
            >
              Clear All Attempts
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
