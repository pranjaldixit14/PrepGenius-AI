import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Building2,
  ArrowLeft,
  CheckCircle2,
  ListTodo,
  Layers,
  Code2,
  BrainCircuit,
  BookOpen,
  ArrowUpRight,
  Sparkles,
  Award
} from 'lucide-react';
import { companyService } from '../services/companyService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { ProgressBar } from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';

export const CompanyDetailPage = () => {
  const { identifier } = useParams();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [completedItems, setCompletedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(`prepgenius_checklist_${identifier}`);
      return saved ? new Set(JSON.parse(saved)) : new Set();
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    fetchCompanyDetail();
  }, [identifier]);

  const fetchCompanyDetail = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanyDetails(identifier);
      if (res?.success && res.company) {
        setCompany(res.company);
      }
    } catch (err) {
      console.error('Failed to load company detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleChecklist = (itemId) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);

      localStorage.setItem(`prepgenius_checklist_${identifier}`, JSON.stringify([...next]));
      return next;
    });
  };

  if (loading) {
    return (
      <div className="space-y-6 max-w-5xl mx-auto">
        <Skeleton className="h-10 w-48 rounded-xl" />
        <Skeleton className="h-48 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (!company) {
    return (
      <div className="text-center py-16">
        <p className="text-slate-400">Company guide not found.</p>
        <Link to="/companies" className="mt-4 inline-block">
          <Button size="sm" variant="secondary" icon={ArrowLeft}>
            Back to Companies
          </Button>
        </Link>
      </div>
    );
  }

  const checklistProgress = company.preparationChecklist?.length > 0
    ? Math.round((completedItems.size / company.preparationChecklist.length) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Back Link */}
      <Link to="/companies" className="inline-flex items-center text-xs text-slate-400 hover:text-cyan-300 gap-1.5 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Company Guides</span>
      </Link>

      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/90 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-purple-950/60 to-cyan-950/60 border border-white/15 flex items-center justify-center text-2xl font-black text-white shadow-lg">
              {company.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{company.name}</h2>
                <Badge variant={company.tier.includes('Tier 1') ? 'purple' : 'cyan'}>{company.tier}</Badge>
              </div>
              <p className="text-xs text-slate-400 mt-1">Placement Preparation & Recruitment Architecture</p>
            </div>
          </div>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            {company.overview}
          </p>
        </div>

        {/* Checklist Completion Gauge */}
        <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 shrink-0 w-full md:w-60 shadow-lg">
          <div className="flex justify-between text-xs text-slate-300 font-medium mb-1.5">
            <span>Guide Readiness</span>
            <span className="text-cyan-400 font-bold">{completedItems.size} / {company.preparationChecklist?.length || 0}</span>
          </div>
          <ProgressBar value={completedItems.size} max={company.preparationChecklist?.length || 1} size="sm" showPercentage={false} />
        </div>
      </div>

      {/* Roles & Core Topics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* DSA Topic Emphasis */}
        <Card className="p-6 space-y-4 bg-[#141b30]/90 border-white/10">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Code2 className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">DSA Topic Emphasis</h3>
          </div>
          <div className="space-y-3">
            {company.dsaEmphasis?.map((dsa, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-200 font-medium">{dsa.topic}</span>
                  <span className="text-cyan-400 font-mono text-[11px] font-semibold">{dsa.weightage}</span>
                </div>
                <ProgressBar value={dsa.importance * 20} max={100} size="sm" showPercentage={false} />
              </div>
            ))}
          </div>
        </Card>

        {/* Core CS Topics & Aptitude */}
        <Card className="p-6 space-y-6 bg-[#141b30]/90 border-white/10">
          <div>
            <div className="flex items-center gap-2 pb-3 border-b border-white/10">
              <BookOpen className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Core CS Focus Areas</h3>
            </div>
            <div className="flex flex-wrap gap-2 pt-3">
              {company.coreCsTopics?.map((topic, idx) => (
                <Badge key={idx} variant="slate" size="md">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 pb-2 border-b border-white/10">
              <BrainCircuit className="w-4 h-4 text-emerald-400" />
              <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Aptitude & Cognitive Focus</h4>
            </div>
            <div className="space-y-2 pt-2">
              {company.aptitudeEmphasis?.map((apt, idx) => (
                <div key={idx} className="flex justify-between text-xs text-slate-300">
                  <span>{apt.topic}</span>
                  <span className="text-emerald-400 font-medium">{apt.weightage}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recruitment Round Structure */}
      {company.interviewPattern?.length > 0 && (
        <Card className="p-6 space-y-4 bg-[#141b30]/90 border-white/10">
          <div className="flex items-center gap-2 pb-3 border-b border-white/10">
            <Layers className="w-5 h-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Interview Round Structure</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {company.interviewPattern.map((round) => (
              <div key={round.round} className="p-4 rounded-xl bg-[#10172a] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-400">Round {round.round}</span>
                  <Badge variant="slate" size="sm">{round.duration}</Badge>
                </div>
                <h4 className="text-sm font-bold text-white">{round.name}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{round.description}</p>
                {round.format && (
                  <p className="text-[11px] text-slate-400 font-mono pt-1">Format: {round.format}</p>
                )}
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Preparation Checklist */}
      {company.preparationChecklist?.length > 0 && (
        <Card className="p-6 space-y-4 bg-[#141b30]/90 border-white/10">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="flex items-center gap-2">
              <ListTodo className="w-5 h-5 text-purple-400" />
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Preparation Checklist</h3>
            </div>
            <span className="text-xs text-slate-400">{completedItems.size} completed</span>
          </div>

          <div className="space-y-2.5">
            {company.preparationChecklist.map((item) => {
              const isDone = completedItems.has(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleToggleChecklist(item.id)}
                  className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-purple-950/50 border-purple-500/50 text-slate-300'
                      : 'bg-[#10172a] border-white/10 hover:border-purple-400/50 text-slate-200 hover:bg-[#162038]'
                  }`}
                >
                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                    isDone
                      ? 'bg-purple-600 border-purple-600 text-white'
                      : 'border-white/20 bg-[#141b30]'
                  }`}>
                    {isDone && <CheckCircle2 className="w-4 h-4 stroke-[3]" />}
                  </div>
                  <div className="flex-1">
                    <span className={isDone ? 'line-through text-slate-400' : 'text-slate-200'}>{item.item}</span>
                    <span className="block text-[10px] text-slate-400 uppercase mt-0.5 font-mono">{item.category}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </Card>
      )}

      {/* Practice Links CTA */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl bg-[#141b30]/90 border border-white/10 shadow-2xl">
        <div>
          <h4 className="text-sm font-bold text-white">Start practicing targeted questions</h4>
          <p className="text-xs text-slate-300 mt-0.5">Solve algorithmic patterns or test your technical answers.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/dsa">
            <Button size="sm" variant="secondary" icon={Code2}>
              DSA Hub
            </Button>
          </Link>
          <Link to="/interview">
            <Button size="sm" variant="primary" icon={Sparkles}>
              Mock Interview
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
