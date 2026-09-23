import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Sparkles, ArrowRight, Target, Briefcase, Zap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card3D } from '../components/common/Card3D';
import { CinematicBackground } from '../components/common/CinematicBackground';

export const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [targetRole, setTargetRole] = useState('Software Engineer');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signup } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await signup({
        name,
        email,
        password,
        targetRole,
        experienceLevel,
      });
      showToast('Welcome to PrepGenius AI!', 'success');
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Account creation failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <CinematicBackground className="py-8 px-4 sm:px-6 lg:px-8">
      {/* Top Header Navigation */}
      <header className="w-full max-w-6xl mx-auto flex items-center justify-between pb-6">
        <Link to="/" className="inline-flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-600 via-fuchsia-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-900/50 text-white group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              PrepGenius <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-mono">AI v2.4</span>
            </span>
          </div>
        </Link>

        <Link
          to="/login"
          className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:border-purple-400/50 transition-all backdrop-blur"
        >
          Sign In ➔
        </Link>
      </header>

      {/* Main Grid */}
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-4">
        
        {/* Left Column: Cinematic Value Proposition */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            COHORT 2026 ENROLLMENT ACTIVE
          </div>

          <h1 className="text-4xl sm:text-5xl font-black tracking-tight leading-[1.15] text-white">
            Build Your Placement Path with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              Intelligent Telemetry
            </span>.
          </h1>

          <p className="text-base text-slate-300 max-w-lg leading-relaxed">
            One platform for real-time ATS optimization, 140+ curated coding pattern roadmaps, timed quantitative drills, and generative AI mock interviews.
          </p>

          <div className="space-y-3 pt-2 max-w-md">
            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141b30]/70 border border-white/[0.08] backdrop-blur">
              <div className="w-8 h-8 rounded-xl bg-purple-950 border border-purple-500/40 flex items-center justify-center text-purple-400 font-bold text-sm">
                1
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Instant ATS Diagnostic</span>
                <span className="text-slate-400">Score against Google & Amazon job specifications</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141b30]/70 border border-white/[0.08] backdrop-blur">
              <div className="w-8 h-8 rounded-xl bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold text-sm">
                2
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Adaptive DSA Matrix</span>
                <span className="text-slate-400">Master high-frequency patterns with AI test execution</span>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 rounded-2xl bg-[#141b30]/70 border border-white/[0.08] backdrop-blur">
              <div className="w-8 h-8 rounded-xl bg-fuchsia-950 border border-fuchsia-500/40 flex items-center justify-center text-fuchsia-400 font-bold text-sm">
                3
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">Real-time AI Mock Interviews</span>
                <span className="text-slate-400">Turn-by-turn evaluation on technical depth & articulation</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating 3D Glass Signup Modal */}
        <div className="lg:col-span-6 w-full max-w-lg mx-auto">
          <Card3D
            maxTilt={5}
            scale={1.01}
            data-cursor-label="✦ 3D SIGNUP"
            className="glass-cinematic rounded-3xl p-6 sm:p-8 relative shadow-2xl"
          >
            {/* View Switcher Header */}
            <div className="flex items-center justify-between p-1 rounded-2xl bg-black/40 border border-white/10 mb-5">
              <Link
                to="/login"
                className="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Sign In
              </Link>
              <span className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md">
                Create Account
              </span>
            </div>

            <div className="mb-4">
              <h2 className="text-2xl font-black text-white tracking-tight">Create Your Account</h2>
              <p className="text-xs text-slate-300 mt-0.5">
                Set up your profile to start personalized AI preparation.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Input
                  label="Full Name"
                  type="text"
                  icon={User}
                  placeholder="Alex Chen"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />

                <Input
                  label="Email address"
                  type="email"
                  icon={Mail}
                  placeholder="alex@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <Input
                label="Password (min. 6 characters)"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Target className="w-3.5 h-3.5 text-purple-400" />
                    <span>Target Role</span>
                  </label>
                  <select
                    value={targetRole}
                    onChange={(e) => setTargetRole(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b30] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="Software Engineer">Software Engineer (SDE-1)</option>
                    <option value="Frontend Developer">Frontend Developer</option>
                    <option value="Backend Developer">Backend Developer</option>
                    <option value="Full Stack Developer">Full Stack Developer</option>
                    <option value="Data Scientist">Data Scientist / ML</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1.5 flex items-center gap-1.5">
                    <Briefcase className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Experience Tier</span>
                  </label>
                  <select
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#141b30] border border-white/15 text-white text-xs font-medium focus:outline-none focus:border-purple-400 transition-colors"
                  >
                    <option value="Fresher">Fresher (2025 / 2026 Batch)</option>
                    <option value="1-2 Years">1-2 Years Experience</option>
                    <option value="3+ Years">3+ Years Experience</option>
                  </select>
                </div>
              </div>

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-2 py-3 rounded-2xl btn-gradient-primary btn-3d text-sm font-bold shadow-lg"
                isLoading={loading}
              >
                Create Account & Launch Preparation ➔
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-slate-400">
              Already have an account?{' '}
              <Link to="/login" className="text-cyan-400 hover:text-cyan-300 font-bold underline underline-offset-2">
                Sign in here
              </Link>
            </div>
          </Card3D>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 border-t border-white/[0.08] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 PrepGenius AI. Precision engineered for top-tier hiring cohorts.</span>
        <span className="font-mono text-cyan-400 text-[11px]">60 FPS Cinematic Motion Active</span>
      </footer>
    </CinematicBackground>
  );
};
