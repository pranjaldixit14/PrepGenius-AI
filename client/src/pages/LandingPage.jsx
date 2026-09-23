import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  MessageSquareCode,
  Code2,
  BrainCircuit,
  Building2,
  BarChart3,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Zap,
  Award,
  ChevronRight
} from 'lucide-react';
import { PublicNavbar } from '../components/layout/PublicNavbar';
import { Footer } from '../components/layout/Footer';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';

export const LandingPage = () => {
  const featureCards = [
    {
      title: 'AI Resume Analyzer',
      description: 'Get structured feedback on your resume, ATS readiness, and missing high-impact technical skills.',
      icon: FileText,
      badge: 'Gemini Powered',
      link: '/resume',
    },
    {
      title: 'AI Mock Interview',
      description: 'Practice realistic technical and behavioral interviews with turn-by-turn evaluation across 5 dimensions.',
      icon: MessageSquareCode,
      badge: 'Interactive',
      link: '/interview',
    },
    {
      title: 'DSA Practice Hub',
      description: 'Solve curated coding problems and track your progress by topic, difficulty, and pattern.',
      icon: Code2,
      badge: 'Curated Patterns',
      link: '/dsa',
    },
    {
      title: 'Aptitude Practice',
      description: 'Improve speed and accuracy with timed quantitative, logical reasoning, and verbal tests.',
      icon: BrainCircuit,
      badge: 'Timed Tests',
      link: '/aptitude',
    },
    {
      title: 'Company Preparation',
      description: 'Prepare with company-specific topics, recruitment patterns, and interview round checklists.',
      icon: Building2,
      badge: 'Top Recruiters',
      link: '/companies',
    },
    {
      title: 'Learning Analytics',
      description: 'See what you have improved and what needs more practice with a unified platform readiness score.',
      icon: BarChart3,
      badge: 'Real-time Stats',
      link: '/dashboard',
    },
  ];

  const steps = [
    {
      number: '01',
      title: 'Upload Resume & Define Goals',
      description: 'Upload your PDF resume to receive instant ATS scoring, keyword gap analysis, and tailored skill recommendations.',
    },
    {
      number: '02',
      title: 'Target Gaps with Curated Practice',
      description: 'Sharpen your coding patterns in the DSA Hub, take timed aptitude quizzes, and master target company interview patterns.',
    },
    {
      number: '03',
      title: 'Simulate Mock Interviews & Track Readiness',
      description: 'Engage with AI-conducted placement rounds, receive objective critique on clarity and correctness, and watch your readiness index rise.',
    },
  ];

  return (
    <div className="min-h-screen bg-[#0d1322] text-slate-200 flex flex-col">
      <PublicNavbar />

      {/* Hero Section */}
      <section className="relative pt-16 pb-20 sm:pt-24 sm:pb-28 overflow-hidden">
        {/* Subtle soothing radial accent */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-6 shadow-md">
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span>Complete Placement Preparation Operating System</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white max-w-4xl mx-auto leading-[1.15]">
            Prepare Smarter. Perform Better in <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400">Every Placement Round.</span>
          </h1>

          <p className="mt-5 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            All-in-one placement workspace connecting your resume, DSA practice, aptitude speed tests, and AI mock interviews into one guided readiness loop.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup" className="w-full sm:w-auto">
              <Button size="lg" variant="primary" icon={ArrowRight} className="w-full sm:w-auto">
                Start Preparing Free
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                Explore Demo Dashboard
              </Button>
            </Link>
          </div>

          {/* Contained product / dashboard preview */}
          <div className="mt-14 max-w-5xl mx-auto rounded-3xl border border-white/10 bg-[#141b30]/90 shadow-2xl p-4 sm:p-5 text-left backdrop-blur-xl">
            <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 mb-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="ml-2 font-mono text-[11px] text-slate-400">prepgenius.ai/dashboard</span>
              </div>
              <Badge variant="cyan" size="sm">Active Session</Badge>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-1">
              <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">ATS RESUME SCORE</span>
                <span className="text-2xl font-black text-emerald-400 mt-1 block">84 / 100</span>
                <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">✓ High placement readiness</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">DSA TOPICS SOLVED</span>
                <span className="text-2xl font-black text-cyan-400 mt-1 block">24 / 45</span>
                <span className="text-[11px] text-slate-400 mt-1 block">Trees, DP & Two Pointers</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">APTITUDE ACCURACY</span>
                <span className="text-2xl font-black text-purple-400 mt-1 block">88%</span>
                <span className="text-[11px] text-slate-400 mt-1 block">Quants & Logical Tests</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10">
                <span className="text-[11px] text-slate-400 block font-bold uppercase">MOCK INTERVIEW</span>
                <span className="text-2xl font-black text-pink-400 mt-1 block">82 / 100</span>
                <span className="text-[11px] text-slate-400 mt-1 block">SDE Technical Round</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Value Strip */}
      <section className="border-y border-white/10 bg-[#0a0f1d] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-5 h-5 text-cyan-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-200">Instant AI ATS & Skill Gap Feedback</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <Award className="w-5 h-5 text-purple-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-200">Company-Specific Round Patterns</span>
          </div>
          <div className="flex items-center justify-center gap-3">
            <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
            <span className="text-sm font-semibold text-slate-200">No False Placement Guarantees</span>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <Badge variant="purple" size="md">Core Platform</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              Everything You Need to Clear Campus & Tech Drives
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Avoid juggling four different websites. PrepGenius synchronizes all preparation steps in a unified, elevated dashboard.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card key={feat.title} hover className="p-6 flex flex-col justify-between bg-[#141b30]/90 border-white/10 hover:border-purple-500/50 hover:bg-[#18233d] transition-all">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 rounded-2xl bg-[#10172a] text-cyan-400 border border-white/10">
                        <Icon className="w-5 h-5" />
                      </div>
                      <Badge variant="slate" size="sm">{feat.badge}</Badge>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{feat.description}</p>
                  </div>
                  <div className="mt-5 pt-4 border-t border-white/10">
                    <Link
                      to={feat.link}
                      className="inline-flex items-center text-xs font-bold text-cyan-400 hover:text-cyan-300 gap-1 transition-colors"
                    >
                      <span>Explore module</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-[#0a0f1d] border-t border-white/10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="cyan" size="md">Step-by-Step</Badge>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              How PrepGenius AI Works
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-300">
              Three clear stages designed to systematically eliminate blind spots before real recruiter screening.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {steps.map((step) => (
              <div key={step.number} className="relative p-6 rounded-2xl bg-[#141b30]/90 border border-white/10 shadow-lg">
                <div className="text-3xl font-black text-purple-500/30 mb-3 font-mono">
                  {step.number}
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto rounded-3xl border border-white/10 bg-[#141b30]/90 p-8 sm:p-12 text-center shadow-2xl backdrop-blur-xl">
          <Badge variant="purple" size="md">Our Philosophy</Badge>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-4">
            Built for Transparent, Measurable Improvement
          </h2>
          <p className="mt-4 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Most placement preparation is disjointed: solving random coding questions without an end plan, guessing why resumes get rejected, or attending mock interviews with zero objective feedback. PrepGenius provides structured metrics, explains every recommendation, and grounds AI evaluations in actual software engineering standards.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-6 text-xs sm:text-sm text-slate-200 font-semibold">
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-emerald-400" /> Evidence-based ATS scoring</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-cyan-400" /> Zero fake placement promises</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-purple-400" /> Complete candidate privacy</span>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 border-t border-white/10 bg-[#0d1322] text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
            Ready to Take Control of Your Placement Journey?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-300">
            Create your profile in under 60 seconds and run your first AI resume critique.
          </p>
          <div className="mt-8">
            <Link to="/signup">
              <Button size="lg" variant="primary" icon={ArrowRight}>
                Get Started Now
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};
