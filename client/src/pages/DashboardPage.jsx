import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  ArrowRight,
  Sparkles,
  Zap,
  CheckCircle2,
  ChevronRight,
  Clock,
  ArrowUpRight,
  Building2,
  Sliders,
  Award,
  Layers,
  Bot
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { dashboardService } from '../services/dashboardService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { Card3D } from '../components/common/Card3D';
import { AICore3D } from '../components/common/AICore3D';

export const DashboardPage = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [telemetryView, setTelemetryView] = useState('gauge'); // 'gauge' | 'orb'
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'queue' | 'analytics' | 'all'

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await dashboardService.getDashboardData();
        if (res?.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-96 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="h-64 rounded-3xl" />
          <Skeleton className="h-64 rounded-3xl lg:col-span-2" />
        </div>
        <Skeleton className="h-20 rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="h-72 rounded-3xl lg:col-span-2" />
          <Skeleton className="h-72 rounded-3xl" />
        </div>
      </div>
    );
  }

  const cards = data?.cards || {};
  const readiness = data?.overallReadiness ?? 78;
  const recommendations = data?.recommendations || [];
  const recentActivity = data?.recentActivity || [];

  return (
    <div className="space-y-7 pb-16">
      {/* Subheader Tracker Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-b border-white/[0.08] pb-4">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#160a2b] border border-purple-500/40 text-purple-300 font-semibold text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
            TARGET ROLE: {user?.targetRole || data?.targetRole || 'SDE-1 (2026 Cohort)'}
          </span>
          <span className="px-3 py-1 rounded-full bg-[#110822] border border-[#23143f] text-slate-400 font-medium text-[11px] hidden sm:inline-flex">
            Google + Amazon Tier-1 Track
          </span>
          <span className="text-slate-500 text-[11px] flex items-center gap-1 hidden md:flex">
            <Clock className="w-3 h-3" />
            Synced 4m ago
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-sm" />
            COPILOT LIVE
          </span>
          <Link
            to="/interview"
            data-cursor-label="⚡ PRACTICE"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-950/60 hover:opacity-95 transition-all"
          >
            <span>Start AI Practice</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Sleek View Filter Tab Bar (Eliminates Congestion & Boosts Focus) */}
      <div className="flex flex-wrap items-center justify-between gap-4 py-1">
        <div className="inline-flex p-1 rounded-2xl bg-[#0e081c]/90 border border-white/[0.08] shadow-inner backdrop-blur">
          {[
            { id: 'overview', label: 'Overview', icon: Layers },
            { id: 'queue', label: 'Action Queue', icon: Sparkles },
            { id: 'analytics', label: 'Analytics & Velocity', icon: Award },
            { id: 'all', label: 'All Modules', icon: Sliders }
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                data-cursor-label={`VIEW ${tab.label.toUpperCase()}`}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white shadow-md shadow-purple-950/70 font-bold scale-[1.02]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <div className="text-xs text-slate-400 font-mono hidden lg:flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-glow-cyan" />
          <span className="text-[11px] tracking-wide">3D SPATIAL CURSOR ACTIVE • GLIDE OVER CARDS</span>
        </div>
      </div>

      {/* Tab View 1: Overview (Readiness, Core Metrics & Quick Sprints) */}
      {(activeTab === 'overview' || activeTab === 'all') && (
        <div className="space-y-6">
          {/* Row 1: Placement Readiness Card + 4 Translucent Metric Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch perspective-1000">
            {/* Placement Readiness Index (Large Circular Gauge / 3D AI Core) */}
            <Card3D
              maxTilt={5}
              scale={1.01}
              data-cursor-label="✦ 3D READINESS"
              className="lg:col-span-4 rounded-3xl bg-gradient-to-b from-[#140b28]/95 to-[#0b0616]/95 border border-white/[0.09] p-6 sm:p-7 shadow-xl flex flex-col justify-between relative overflow-hidden"
            >
          <div className="absolute top-0 right-0 w-44 h-44 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

          {/* Top header & WoW badge */}
          <div className="flex items-center justify-between mb-2 layer-z-20">
            <div>
              <p className="text-[10px] font-extrabold tracking-widest text-slate-400 uppercase">
                Corporate Telemetry
              </p>
              <h3 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                Placement Readiness
              </h3>
            </div>
            
            {/* 2D Gauge / 3D Core View Switcher */}
            <div className="flex items-center gap-1 p-0.5 rounded-xl bg-[#100722] border border-purple-500/30">
              <button
                type="button"
                onClick={() => setTelemetryView('gauge')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all ${
                  telemetryView === 'gauge'
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Gauge
              </button>
              <button
                type="button"
                onClick={() => setTelemetryView('orb')}
                className={`px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono transition-all flex items-center gap-1 ${
                  telemetryView === 'orb'
                    ? 'bg-gradient-to-r from-cyan-600 to-fuchsia-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                3D Orb
              </button>
            </div>
          </div>

          {/* Center Display: 2D Gauge or 3D AI Core */}
          <div className="py-3 flex flex-col items-center justify-center relative min-h-[190px]">
            {telemetryView === 'gauge' ? (
              <div className="relative w-44 h-44 flex items-center justify-center layer-z-20">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <defs>
                    <linearGradient id="readinessGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#8b5cf6" />
                      <stop offset="50%" stopColor="#a855f7" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  {/* Track */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="#1b1036"
                    strokeWidth="8"
                  />
                  {/* Progress bar with gradient and glow */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    stroke="url(#readinessGradient)"
                    strokeWidth="8"
                    strokeDasharray={`${(readiness / 100) * 251.327} 251.327`}
                    strokeDashoffset="0"
                    strokeLinecap="round"
                    filter="url(#glow)"
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>

                {/* Gauge Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center layer-z-30">
                  <div className="flex items-baseline">
                    <span className="text-4xl font-black text-white tracking-tight">{readiness}</span>
                    <span className="text-xs text-slate-400 font-bold ml-1 font-mono">/100</span>
                  </div>
                  <span className="text-[9px] font-extrabold px-2 py-0.5 mt-1 rounded-full bg-[#1b0d35] border border-purple-500/40 text-purple-300 uppercase tracking-wider">
                    {readiness >= 75 ? 'HIGH POTENTIAL' : readiness >= 50 ? 'COMPETITIVE' : 'DEVELOPING'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center relative layer-z-30">
                <AICore3D size={170} readiness={readiness} />
                <div className="text-[10px] font-mono text-cyan-300 bg-cyan-950/70 border border-cyan-500/30 px-2.5 py-0.5 rounded-full mt-1">
                  Drag to rotate • 60 FPS 3D Mesh
                </div>
              </div>
            )}
          </div>

          {/* Bottom Benchmarks */}
          <div className="pt-3 border-t border-[#21123d] flex items-center justify-between text-xs layer-z-10">
            <div>
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Target Benchmark</span>
              <span className="font-mono font-bold text-slate-200">85.0+</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider block font-medium">Gap to Clear</span>
              <span className="font-mono font-bold text-cyan-400">
                {readiness >= 85 ? `+${(readiness - 85).toFixed(1)} pts` : `${(readiness - 85).toFixed(1)} pts`}
              </span>
            </div>
          </div>
        </Card3D>

        {/* 4 Core Metric Cards (Grid 2x2) with 3D Spatial Physics */}
        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Card 1: Resume ATS */}
          <Link to="/resume" className="block">
            <Card3D
              maxTilt={7}
              scale={1.02}
              data-cursor-label="✦ 3D ATS"
              className="p-6 h-full rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-purple-500/50 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between layer-z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1d0e38] text-purple-400 border border-purple-500/30">
                    <FileText className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Resume ATS</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c0f36] border border-purple-500/30 text-purple-300">
                  TOP 12%
                </span>
              </div>

              <div className="my-4 flex items-baseline justify-between layer-z-30">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">{cards.resume?.score || 84}</span>
                  <span className="text-xs text-slate-400 font-medium font-mono">/100</span>
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-[#240e33] border border-fuchsia-500/40 text-fuchsia-300">
                  2 Updates Pending
                </span>
              </div>

              <div className="space-y-2 pt-3 border-t border-white/[0.06] layer-z-10">
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Keyword Density</span>
                  <span className="text-cyan-400 font-bold font-mono">91% aligned</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a0e30] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[91%] rounded-full shadow-glow-cyan" />
                </div>
              </div>
            </Card3D>
          </Link>

          {/* Card 2: DSA Mastery */}
          <Link to="/dsa" className="block">
            <Card3D
              maxTilt={7}
              scale={1.02}
              data-cursor-label="✦ 3D DSA"
              className="p-6 h-full rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-cyan-500/50 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between layer-z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#08202d] text-cyan-400 border border-cyan-500/30">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">DSA Mastery</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#08202d] border border-cyan-500/30 text-cyan-300">
                  {cards.dsa?.solved || 142}/250
                </span>
              </div>

              <div className="my-4 layer-z-30">
                <div className="flex items-center gap-3 text-xs font-mono">
                  <span className="text-slate-300 font-medium">Easy: <strong className="text-emerald-400 font-bold">78</strong></span>
                  <span className="text-slate-300 font-medium">Med: <strong className="text-amber-400 font-bold">54</strong></span>
                  <span className="text-slate-300 font-medium">Hard: <strong className="text-rose-400 font-bold">10</strong></span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] layer-z-10">
                <span className="text-slate-400">Topic Focus:</span>
                <span className="text-purple-300 font-medium">DP • Sliding Window</span>
              </div>
            </Card3D>
          </Link>

          {/* Card 3: Aptitude Speed */}
          <Link to="/aptitude" className="block">
            <Card3D
              maxTilt={7}
              scale={1.02}
              data-cursor-label="✦ 3D QUANT"
              className="p-6 h-full rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-purple-500/50 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between layer-z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#1d0e38] text-purple-400 border border-purple-500/30">
                    <BrainCircuit className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">Aptitude Speed</h4>
                </div>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#1c0f36] border border-purple-500/30 text-purple-300">
                  45s/q avg
                </span>
              </div>

              <div className="my-4 layer-z-30">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">{cards.aptitude?.averageAccuracy || 81}%</span>
                  <span className="text-xs text-slate-400 font-medium">Accuracy</span>
                </div>
              </div>

              <div className="pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center layer-z-10">
                <div className="p-1.5 rounded-lg bg-[#160a2b] border border-[#241544]">
                  <span className="text-[9px] text-slate-400 uppercase block">Quant</span>
                  <span className="text-xs font-bold text-cyan-400 font-mono">86%</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#160a2b] border border-[#241544]">
                  <span className="text-[9px] text-slate-400 uppercase block">Logic</span>
                  <span className="text-xs font-bold text-purple-300 font-mono">82%</span>
                </div>
                <div className="p-1.5 rounded-lg bg-[#160a2b] border border-[#241544]">
                  <span className="text-[9px] text-slate-400 uppercase block">Verbal</span>
                  <span className="text-xs font-bold text-fuchsia-300 font-mono">76%</span>
                </div>
              </div>
            </Card3D>
          </Link>

          {/* Card 4: AI Mock Rating */}
          <Link to="/interview" className="block">
            <Card3D
              maxTilt={7}
              scale={1.02}
              data-cursor-label="✦ 3D MOCK"
              className="p-6 h-full rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-cyan-500/50 flex flex-col justify-between"
            >
              <div className="flex items-start justify-between layer-z-20">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-[#08202d] text-cyan-400 border border-cyan-500/30">
                    <Bot className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white tracking-tight">AI Mock Rating</h4>
                </div>
                <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded bg-[#08202d] border border-cyan-500/30 text-cyan-300 tracking-wider">
                  GEMINI 1.5 MOCK
                </span>
              </div>

              <div className="my-4 flex items-baseline justify-between layer-z-30">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-white">4.2</span>
                  <span className="text-xs text-slate-400 font-medium font-mono">/ 5.0</span>
                </div>
                <span className="text-xs text-slate-400 font-medium">5 Full Sessions</span>
              </div>

              <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-[11px] layer-z-10">
                <span className="text-slate-400">Turn Depth & Articulation</span>
                <span className="text-cyan-400 font-bold font-mono">88% pass prob.</span>
              </div>
            </Card3D>
          </Link>
        </div>
      </div>

      {/* Row 2: Quick Sprint Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-[#0e081c]/90 border border-white/[0.08] shadow-lg flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 rounded-2xl bg-[#1e0e3b] text-fuchsia-400 border border-fuchsia-500/30 shadow-glow-magenta">
            <Zap className="w-4 h-4 fill-fuchsia-400" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Quick Sprint</h4>
            <p className="text-[10px] text-slate-400 uppercase font-mono tracking-wider font-semibold">1-Click Launchers</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/resume"
            data-cursor-label="⚡ SCAN ATS"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#160d2e] border border-white/[0.08] hover:border-purple-500/50 text-purple-200 text-xs font-semibold hover:bg-[#20133f] transition-all"
          >
            <FileText className="w-3.5 h-3.5 text-purple-400" />
            <span>Resume ATS Scan</span>
          </Link>

          <Link
            to="/dsa"
            data-cursor-label="⚡ SOLVE DSA"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#091b26] border border-white/[0.08] hover:border-cyan-500/50 text-cyan-200 text-xs font-semibold hover:bg-[#0e2738] transition-all"
          >
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Daily DSA: Two Pointers</span>
          </Link>

          <Link
            to="/aptitude"
            data-cursor-label="⚡ TIMED QUANT"
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#230f28] border border-white/[0.08] hover:border-fuchsia-500/50 text-fuchsia-200 text-xs font-semibold hover:bg-[#32153a] transition-all"
          >
            <BrainCircuit className="w-3.5 h-3.5 text-fuchsia-400" />
            <span>15m Timed Quant</span>
          </Link>

          <Link
            to="/interview"
            data-cursor-label="⚡ START MOCK"
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-purple-600 via-fuchsia-600 to-pink-600 text-white text-xs font-bold shadow-md shadow-purple-950/60 hover:opacity-95 active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Adaptive AI Mock</span>
          </Link>
        </div>
      </div>
    </div>
  )}

      {/* Tab View 2: Action Queue (Priority Recommendations & Target Company Benchmarks) */}
      {(activeTab === 'queue' || activeTab === 'all') && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: AI Priority Queue */}
          <div className="lg:col-span-8 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-fuchsia-400" />
                <span>AI Priority Queue</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">Dynamic Recommendations</span>
            </div>

            <div className="space-y-4">
              {/* Rec 1: Longest Substring */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-purple-500/40 card-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 uppercase">
                      HIGH
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      Longest Substring Without Repeating Characters
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#180e2e] border border-purple-500/30 text-purple-300 font-mono">
                      Sliding Window
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Flagged in recent Google & Microsoft interview rounds. Target: O(n) linear scan time.
                  </p>
                </div>

                <Link to="/dsa" className="shrink-0">
                  <button
                    type="button"
                    data-cursor-label="➔ SOLVE"
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-purple-950 flex items-center gap-1.5 active:scale-95 transition-all"
                  >
                    <span>Code Now</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Rec 2: Inject Kafka & Docker */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-cyan-500/40 card-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-[#08202d] text-cyan-300 border border-cyan-500/40 uppercase">
                      ATS GAP
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      Inject Kafka & Docker Production Metrics
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#08202d] border border-cyan-500/30 text-cyan-300 font-mono font-bold">
                      +7 PTS BOOST
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Matches 3 Amazon SDE-1 requirements. Will upgrade ATS score from 84 to 91 instantly.
                  </p>
                </div>

                <Link to="/resume" className="shrink-0">
                  <button
                    type="button"
                    data-cursor-label="➔ INJECT"
                    className="px-4 py-2 rounded-xl bg-[#140b2b] hover:bg-[#1d103b] border border-white/[0.1] text-purple-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Auto-Inject</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>

              {/* Rec 3: Solve 5 Rapid MCQs */}
              <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] hover:border-purple-500/40 card-lift transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-2 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[9px] font-black px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 uppercase">
                      SPEED
                    </span>
                    <h4 className="text-sm font-bold text-white truncate">
                      Solve 5 Rapid Quantitative MCQs
                    </h4>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#180e2e] border border-purple-500/30 text-purple-300 font-mono">
                      Combinatorics
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Target under 40s per problem to clear standard online assessment velocity ceilings.
                  </p>
                </div>

                <Link to="/aptitude" className="shrink-0">
                  <button
                    type="button"
                    data-cursor-label="➔ TEST"
                    className="px-4 py-2 rounded-xl bg-[#140b2b] hover:bg-[#1d103b] border border-white/[0.1] text-purple-200 hover:text-white font-semibold text-xs transition-all flex items-center gap-1.5"
                  >
                    <span>Quick Test</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column: Company Readiness */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-fuchsia-400" />
                <span>Company Readiness</span>
              </h3>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">Cohort Tracker</span>
            </div>

            <Card className="p-6 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] space-y-4">
              {/* Google */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Google</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1e0d36] border border-fuchsia-500/40 text-fuchsia-300">
                      Drive in 19d
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">74%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a0f33] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 w-[74%] rounded-full shadow-glow-cyan" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>OA: 82%</span>
                  <span>DSA: 75%</span>
                  <span>Sys/CS: 65%</span>
                </div>
              </div>

              {/* Amazon */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Amazon</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#08202d] border border-cyan-500/40 text-cyan-300">
                      Bar Raiser Track
                    </span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400">88%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a0f33] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[88%] rounded-full shadow-glow-cyan" />
                </div>
                <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>LP Metrics: 92%</span>
                  <span>Coding: 85%</span>
                </div>
              </div>

              {/* Microsoft */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">Microsoft</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#1c0e35] border border-purple-500/40 text-purple-300">
                      In Review
                    </span>
                  </div>
                  <span className="font-mono font-bold text-white">79%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a0f33] rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-500 to-pink-500 w-[79%] rounded-full" />
                </div>
              </div>

              {/* TCS Digital */}
              <div className="space-y-1.5 pt-2 border-t border-white/[0.06]">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white">TCS Digital</span>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#08202d] border border-cyan-500/40 text-cyan-300 font-bold">
                      NQT
                    </span>
                  </div>
                  <span className="font-mono font-bold text-cyan-400">94%</span>
                </div>
                <div className="w-full h-1.5 bg-[#1a0f33] rounded-full overflow-hidden">
                  <div className="h-full bg-cyan-400 w-[94%] rounded-full shadow-glow-cyan" />
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* Tab View 3: Analytics, Velocity & Diagnostic Systems */}
      {(activeTab === 'analytics' || activeTab === 'all') && (
        <div className="space-y-6">
          {/* Row 4: Practice Velocity (Dual-tone Bar Chart) */}
          <Card className="p-6 sm:p-7 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-white/[0.08] space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <span className="text-fuchsia-400">📊</span>
              <span>Practice Velocity</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Daily DSA problems resolved vs AI interview simulation minutes over the current cycle
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs">
            <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-cyan-400 shadow-glow-cyan" />
              QUESTIONS SOLVED
            </span>
            <span className="flex items-center gap-1.5 text-slate-300 font-mono text-[11px]">
              <span className="w-2.5 h-2.5 rounded-sm bg-fuchsia-500 shadow-glow-magenta" />
              MOCK MINUTES
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1b0d35] border border-purple-500/40 text-purple-300 font-mono text-[10px] font-bold">
              14d Active Streak
            </span>
          </div>
        </div>

        {/* Dual Bar Chart Canvas */}
        <div className="relative pt-6 pb-2">
          {/* Floating Peak Tooltip Indicator */}
          <div className="absolute top-0 right-[28%] -translate-x-1/2 flex flex-col items-center">
            <span className="px-2 py-0.5 rounded-md bg-[#240e36] border border-fuchsia-500/50 text-fuchsia-200 text-[10px] font-mono font-bold shadow-lg shadow-fuchsia-950/80">
              Peak: 12 Solved
            </span>
            <div className="w-0 h-0 border-x-4 border-x-transparent border-t-4 border-t-fuchsia-500/50" />
          </div>

          <div className="h-44 flex items-end justify-between gap-3 px-2 sm:px-6">
            {[
              { day: 'M', solved: 45, mins: 30 },
              { day: 'T', solved: 60, mins: 45 },
              { day: 'W', solved: 75, mins: 55 },
              { day: 'T', solved: 40, mins: 25 },
              { day: 'F', solved: 95, mins: 80 },
              { day: 'S', solved: 70, mins: 60 },
              { day: 'S', solved: 55, mins: 40 },
            ].map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="w-full flex items-end justify-center gap-1.5 h-36">
                  {/* Cyan Bar: Solved */}
                  <div
                    style={{ height: `${d.solved}%` }}
                    className="w-3.5 sm:w-5 bg-gradient-to-t from-cyan-600 to-cyan-400 rounded-t-md transition-all duration-300 group-hover:brightness-125 shadow-glow-cyan"
                  />
                  {/* Magenta Bar: Mock Minutes */}
                  <div
                    style={{ height: `${d.mins}%` }}
                    className="w-3.5 sm:w-5 bg-gradient-to-t from-fuchsia-700 to-fuchsia-400 rounded-t-md transition-all duration-300 group-hover:brightness-125 shadow-glow-magenta"
                  />
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">{d.day}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#1d1238] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <span className="text-slate-400 font-mono text-[11px]">
            Weekly Aggregate: <strong className="text-white">42 Solved</strong> • <strong className="text-fuchsia-400">185 Mock Mins</strong>
          </span>
          <span className="text-cyan-400 font-bold font-mono text-[11px]">
            94th percentile against cohort
          </span>
        </div>
      </Card>

      {/* Row 5: Activity Audit Feed & AI Diagnostic Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left (2/3): Activity Audit Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-fuchsia-400" />
              <span>Activity Audit Feed</span>
            </h3>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider font-semibold uppercase">Live Stream</span>
          </div>

          <div className="space-y-3">
            {/* Feed item 1 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-[#24143f] hover:border-purple-500/40 card-lift transition-all flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#08202d] text-cyan-400 border border-cyan-500/30 shrink-0 mt-0.5">
                  <Code2 className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">Solved: Container With Most Water</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#08202d] border border-cyan-500/30 text-cyan-300">
                      Medium
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Runtime: 18 min • Complexity: O(n) - Two-Pointer pattern</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">22m ago</span>
            </div>

            {/* Feed item 2 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-[#24143f] hover:border-purple-500/40 card-lift transition-all flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#230f36] text-fuchsia-400 border border-fuchsia-500/30 shrink-0 mt-0.5">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">Gemini Mock Interview: Round 1 Completed</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#230f36] border border-fuchsia-500/30 text-fuchsia-300">
                      Score: 4.4/5.0
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Binary Trees & Dynamic Programming • Feedback: Strong structure, improve memory bounds</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">3h ago</span>
            </div>

            {/* Feed item 3 */}
            <div className="p-4 rounded-2xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-[#24143f] hover:border-purple-500/40 card-lift transition-all flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-[#1d0e38] text-purple-400 border border-purple-500/30 shrink-0 mt-0.5">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-bold text-white truncate">ATS Resume Re-scan Complete</h4>
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-[#08202d] border border-cyan-500/30 text-cyan-300 font-bold">
                      +8 PTS BOOST
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-0.5">Added Redis cache metric telemetry & AWS ECS orchestrator tags</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-slate-500 shrink-0">1d ago</span>
            </div>
          </div>
        </div>

        {/* Right (1/3): AI Diagnostic Summary */}
        <div className="lg:col-span-4">
          <Card className="p-5 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-[#24143f] h-full flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-fuchsia-400" />
                  <span>AI Diagnostic Summary</span>
                </h4>
                <span className="w-2 h-2 rounded-full bg-fuchsia-500 shadow-glow-magenta" />
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Candidate is in high readiness tier for product firms. Critical path recommendation: improve System Design basic concurrency primitives to cross 85 Tier-1 threshold.
              </p>

              <div className="space-y-2.5 pt-2">
                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Mock Think Depth</span>
                    <span className="text-purple-300 font-mono font-bold">86%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a0e30] rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 w-[86%]" />
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">Problem Velocity</span>
                    <span className="text-cyan-400 font-mono font-bold">92%</span>
                  </div>
                  <div className="w-full h-1 bg-[#1a0e30] rounded-full overflow-hidden">
                    <div className="h-full bg-cyan-400 w-[92%] shadow-glow-cyan" />
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full py-2.5 rounded-xl bg-[#140b2b] hover:bg-[#1d103b] border border-purple-500/40 text-purple-200 hover:text-white font-semibold text-xs transition-all flex items-center justify-center gap-2 mt-2">
              <span>Download Detailed Audit</span>
              <span>⤓</span>
            </button>
          </Card>
        </div>
      </div>

      {/* Row 6: System Interactive Micro-States Showcase */}
      <Card className="p-6 rounded-3xl bg-gradient-to-b from-[#130b26]/90 to-[#0c071a]/95 border border-[#24143f] space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1d1238]">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-fuchsia-400" />
            <h4 className="text-xs sm:text-sm font-bold text-white">System Interactive Micro-States Showcase</h4>
          </div>
          <span className="text-[10px] text-slate-500 font-mono tracking-wider font-semibold uppercase">
            Design Token Inspection • Precision UI
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 perspective-1000">
          {/* Interactive Token 1: 3D Card Tilt with Popout Layer */}
          <Card3D maxTilt={12} scale={1.03} className="p-4 rounded-2xl bg-[#0e081c] border border-purple-500/30 hover:border-cyan-500/50 cursor-pointer">
            <div className="flex items-center justify-between mb-1.5 layer-z-20">
              <span className="text-[10px] text-cyan-400 uppercase font-mono font-bold">3D Tilt & Specular Glare</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
            </div>
            <h5 className="text-xs font-bold text-white mb-1 layer-z-30">Spatial Gyro & Cursor Physics</h5>
            <p className="text-[11px] text-slate-400 leading-relaxed layer-z-10">
              Move cursor across this card to inspect the real-time perspective tilt, radial light reflection, and Z-axis popout.
            </p>
          </Card3D>

          {/* Interactive Token 2: 3D Floating Badges */}
          <div className="p-4 rounded-2xl bg-[#0e081c] border border-[#23143f] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-fuchsia-400 uppercase font-mono font-bold">3D Floating Badges</span>
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-glow-cyan" />
            </div>
            <div className="flex flex-wrap gap-1.5 pt-0.5 animate-float-3d">
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 shadow-sm">Ready - Safe</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 border border-purple-500/40 shadow-sm">At Limit</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-fuchsia-950/80 text-fuchsia-300 border border-fuchsia-500/40 shadow-sm">Quant - Add</span>
              <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-rose-950/80 text-rose-300 border border-rose-500/40 shadow-sm">Gap - Flagged</span>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Autonomous spatial oscillation giving status elements realistic zero-gravity elevation.
            </p>
          </div>

          {/* Interactive Token 3: 3D Tactile Extruded Buttons */}
          <div className="p-4 rounded-2xl bg-[#0e081c] border border-[#23143f] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] text-purple-400 uppercase font-mono font-bold">3D Tactile Buttons</span>
              <span className="w-2 h-2 rounded-full bg-fuchsia-400 shadow-glow-magenta" />
            </div>
            <div className="flex items-center gap-2 pt-0.5">
              <button className="btn-gradient-primary btn-3d text-[11px] font-bold px-3 py-1.5 rounded-xl">
                3D Primary Push
              </button>
              <button className="btn-subdued-ghost text-[11px] font-semibold px-3 py-1.5 rounded-xl hover:border-purple-400">
                Subdued Ghost
              </button>
            </div>
            <p className="text-[11px] text-slate-400 pt-1">
              Engineered spring-return tactile depressions providing instant haptic response.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )}
</div>
);
};
