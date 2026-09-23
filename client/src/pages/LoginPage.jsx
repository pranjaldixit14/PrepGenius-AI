import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Sparkles, ArrowRight, ShieldCheck, Zap, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Input } from '../components/common/Input';
import { Button } from '../components/common/Button';
import { Card3D } from '../components/common/Card3D';
import { CinematicBackground } from '../components/common/CinematicBackground';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await login(email, password);
      showToast('Logged in successfully!', 'success');
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoAccount = () => {
    setEmail('candidate@prepgenius.ai');
    setPassword('prepgenius2026');
    setError('');
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
          to="/signup"
          className="text-xs font-bold text-slate-300 hover:text-white px-4 py-2 rounded-xl bg-white/[0.05] border border-white/[0.1] hover:border-purple-400/50 transition-all backdrop-blur"
        >
          Create Account ➔
        </Link>
      </header>

      {/* Main Grid: Cinematic Value Proposition & Floating Auth Card */}
      <main className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center my-auto py-6">
        
        {/* Left Column: Cinematic Value Proposition */}
        <div className="lg:col-span-7 space-y-6 text-left">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-950/80 border border-purple-500/40 text-purple-300 text-xs font-mono font-bold tracking-wide">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#22d3ee]" />
            AUTONOMOUS PLACEMENT ENGINE
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] text-white">
            Crack Tier-1 Tech Interviews with{' '}
            <span className="bg-gradient-to-r from-purple-400 via-fuchsia-300 to-cyan-300 bg-clip-text text-transparent">
              AI Precision
            </span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-xl leading-relaxed">
            Real-time ATS resume calibration, adaptive Google-tier DSA problem sprints, and realistic conversational behavioral simulations.
          </p>

          {/* Highlights Strip */}
          <div className="grid grid-cols-3 gap-4 pt-2 max-w-lg">
            <div className="p-4 rounded-2xl bg-[#141b30]/80 border border-white/[0.08] backdrop-blur shadow-sm">
              <div className="text-2xl font-black text-cyan-400 font-mono">94.2%</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Interview Clearance</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#141b30]/80 border border-white/[0.08] backdrop-blur shadow-sm">
              <div className="text-2xl font-black text-fuchsia-400 font-mono">140+</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Curated Patterns</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#141b30]/80 border border-white/[0.08] backdrop-blur shadow-sm">
              <div className="text-2xl font-black text-purple-300 font-mono">&lt; 40s</div>
              <div className="text-xs text-slate-300 font-medium mt-0.5">Quant Speed Benchmark</div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating 3D Glass Auth Modal */}
        <div className="lg:col-span-5 w-full max-w-md mx-auto">
          <Card3D
            maxTilt={6}
            scale={1.01}
            data-cursor-label="✦ 3D AUTH"
            className="glass-cinematic rounded-3xl p-7 sm:p-8 relative shadow-2xl"
          >
            {/* View Switcher Header */}
            <div className="flex items-center justify-between p-1 rounded-2xl bg-black/40 border border-white/10 mb-6">
              <span className="flex-1 py-2 text-center text-xs font-bold rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-md">
                Sign In
              </span>
              <Link
                to="/signup"
                className="flex-1 py-2 text-center text-xs font-bold rounded-xl text-slate-400 hover:text-white transition-colors"
              >
                Create Account
              </Link>
            </div>

            <div className="mb-5">
              <h2 className="text-2xl font-black text-white tracking-tight">Welcome Back</h2>
              <p className="text-xs text-slate-300 mt-1">
                Sign in to access your placement dashboard and live AI sessions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400" />
                  <span>{error}</span>
                </div>
              )}

              <Input
                label="Email address"
                type="email"
                icon={Mail}
                placeholder="candidate@university.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <Input
                label="Password"
                type="password"
                icon={Lock}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button
                type="submit"
                variant="primary"
                className="w-full mt-3 py-3 rounded-2xl btn-gradient-primary btn-3d text-sm font-bold shadow-lg"
                isLoading={loading}
              >
                Enter Command Center ➔
              </Button>
            </form>

            {/* Quick Demo Credentials Autofill */}
            <div className="mt-5 pt-4 border-t border-white/10 flex flex-col items-center gap-3">
              <button
                type="button"
                onClick={fillDemoAccount}
                data-cursor-label="⚡ AUTO-FILL"
                className="w-full py-2 px-3 rounded-xl bg-[#1a233d]/90 hover:bg-[#232f50] border border-cyan-500/30 text-cyan-300 hover:text-cyan-200 text-xs font-mono font-semibold transition-all flex items-center justify-center gap-1.5"
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400 fill-cyan-400" />
                <span>Fill Demo Credentials (Instant Access)</span>
              </button>

              <p className="text-xs text-slate-400">
                New candidate?{' '}
                <Link to="/signup" className="text-fuchsia-400 hover:text-fuchsia-300 font-bold underline underline-offset-2">
                  Create account
                </Link>
              </p>
            </div>
          </Card3D>
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full max-w-6xl mx-auto pt-6 border-t border-white/[0.08] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-2">
        <span>© 2026 PrepGenius AI. Precision engineered for high-placement engineering cohorts.</span>
        <span className="font-mono text-cyan-400 text-[11px]">60 FPS Cinematic Motion Active</span>
      </footer>
    </CinematicBackground>
  );
};
