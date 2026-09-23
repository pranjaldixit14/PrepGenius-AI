import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  MessageSquareCode,
  Sparkles,
  Plus,
  Clock,
  CheckCircle2,
  Award,
  ChevronRight,
  ShieldCheck,
  Play
} from 'lucide-react';
import { interviewService } from '../services/interviewService';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Modal } from '../components/common/Modal';
import { Skeleton } from '../components/common/Skeleton';

export const InterviewPage = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  // Configuration state
  const [role, setRole] = useState(user?.targetRole || 'Software Engineer');
  const [type, setType] = useState('Mixed');
  const [difficulty, setDifficulty] = useState('Medium');
  const [totalQuestions, setTotalQuestions] = useState(5);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await interviewService.getSessions();
      if (res?.success && res.sessions) {
        setSessions(res.sessions);
      }
    } catch (err) {
      console.error('Failed to load interview history:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartInterview = async () => {
    try {
      setIsCreating(true);
      const res = await interviewService.createSession({
        role,
        type,
        difficulty,
        totalQuestions,
      });

      if (res?.success && res.session) {
        showToast('Mock interview session ready!', 'success');
        navigate(`/interview/session/${res.session._id || res.session.id}`);
      }
    } catch (err) {
      console.error('Session creation error:', err);
      showToast(err.message || 'Failed to start interview session', 'error');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/95 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Conversational Evaluator</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            AI Mock Interview
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Simulate realistic technical and behavioral placement rounds with real-time feedback on correctness, clarity, and depth.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Play}
          onClick={() => setIsModalOpen(true)}
        >
          New Mock Interview
        </Button>
      </div>

      {/* Feature Highlights Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 text-xs space-y-1">
          <span className="font-bold text-white block">5 Evaluation Dimensions</span>
          <p className="text-slate-400">Correctness, relevance, structure, completeness, and clarity.</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 text-xs space-y-1">
          <span className="font-bold text-white block">Adaptive Prompting</span>
          <p className="text-slate-400">Questions calibrate to your chosen role, target stack, and prior answers.</p>
        </div>
        <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 text-xs space-y-1">
          <span className="font-bold text-white block">Actionable Report Card</span>
          <p className="text-slate-400">Constructive feedback and refinement tips to ace actual drive interviews.</p>
        </div>
      </div>

      {/* Past Sessions List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <Clock className="w-4 h-4 text-slate-400" />
            <span>Interview Session History</span>
          </h3>
          <span className="text-xs text-slate-400">{sessions.length} sessions recorded</span>
        </div>

        <Card className="overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-3">
              <Skeleton className="h-12 w-full rounded-xl" />
              <Skeleton className="h-12 w-full rounded-xl" />
            </div>
          ) : sessions.length > 0 ? (
            <div className="divide-y divide-white/[0.06]">
              {sessions.map((s) => (
                <div
                  key={s._id || s.id}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-white/[0.03] transition-colors"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/30">
                      <MessageSquareCode className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-semibold text-white">{s.role}</h4>
                        <Badge variant="purple" size="sm">{s.type}</Badge>
                        <Badge variant="slate" size="sm">{s.difficulty}</Badge>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {new Date(s.createdAt).toLocaleDateString()} • {s.turns?.length || s.totalQuestions} questions
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 uppercase block">Status</span>
                      <Badge variant={s.status === 'completed' ? 'emerald' : 'amber'} size="sm">
                        {s.status === 'completed' ? `${s.overallScore}/100 Score` : 'In Progress'}
                      </Badge>
                    </div>

                    <Link to={`/interview/session/${s._id || s.id}`}>
                      <Button size="sm" variant="secondary" icon={ChevronRight}>
                        {s.status === 'completed' ? 'View Report' : 'Resume'}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-xs text-slate-400">
              No mock interviews conducted yet. Click "New Mock Interview" to test your communication and technical skills.
            </div>
          )}
        </Card>
      </div>

      {/* Configuration Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Configure Mock Interview"
      >
        <div className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Target Engineering Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full bg-[#10172a] border border-white/15 rounded-xl px-3.5 py-2 text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            >
              <option value="Software Engineer">Software Engineer (General SDE)</option>
              <option value="Frontend Developer">Frontend Developer (React / JavaScript)</option>
              <option value="Backend Developer">Backend Developer (Node.js / Systems)</option>
              <option value="Data Engineer">Data Engineer / Analyst</option>
              <option value="Full Stack Developer">Full Stack Developer</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Interview Focus</label>
            <div className="grid grid-cols-3 gap-2">
              {['Mixed', 'Technical', 'Behavioral'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setType(t)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${
                    type === t
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-transparent shadow-md'
                      : 'bg-[#10172a] text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Difficulty Level</label>
            <div className="grid grid-cols-3 gap-2">
              {['Easy', 'Medium', 'Hard'].map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDifficulty(d)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${
                    difficulty === d
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-transparent shadow-md'
                      : 'bg-[#10172a] text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-200 font-semibold mb-1.5">Question Count</label>
            <div className="grid grid-cols-3 gap-2">
              {[3, 5, 10].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setTotalQuestions(c)}
                  className={`py-2 rounded-xl font-bold border transition-colors ${
                    totalQuestions === c
                      ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white border-transparent shadow-md'
                      : 'bg-[#10172a] text-slate-300 border-white/10 hover:border-white/20'
                  }`}
                >
                  {c} Questions
                </button>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-white/10 flex justify-end gap-3">
            <Button variant="ghost" size="sm" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              icon={Play}
              isLoading={isCreating}
              onClick={handleStartInterview}
            >
              Start Session
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
