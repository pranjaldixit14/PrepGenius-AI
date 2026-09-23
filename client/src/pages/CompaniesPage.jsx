import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Sparkles,
  Search,
  ChevronRight,
  Shield,
  Layers,
  CheckCircle2,
  Award
} from 'lucide-react';
import { companyService } from '../services/companyService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';

export const CompaniesPage = () => {
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTier, setSelectedTier] = useState('All');

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      setLoading(true);
      const res = await companyService.getCompanies();
      if (res?.success && res.companies) {
        setCompanies(res.companies);
      }
    } catch (err) {
      console.error('Failed to load companies:', err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = companies.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.overview.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTier = selectedTier === 'All' || c.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const tiers = ['All', 'Tier 1 / Product', 'Service / Enterprise'];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/90 backdrop-blur-xl shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-300 text-xs font-semibold mb-2">
            <Building2 className="w-3.5 h-3.5 text-purple-400" />
            <span>Targeted Placement Playbooks</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
            Company Preparation Guides
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Syllabus focus, DSA topic weightages, and verified round structures for top campus recruiters.
          </p>
        </div>

        <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#10172a] border border-white/10 text-xs text-slate-300 shadow-md">
          <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>Pattern-based preparation guides</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card className="p-4 flex flex-col sm:flex-row items-center gap-4 bg-[#141b30]/90 border-white/10">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search company by name or keywords..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#10172a] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto shrink-0">
          {tiers.map((t) => (
            <button
              key={t}
              onClick={() => setSelectedTier(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedTier === t
                  ? 'bg-purple-600 text-white shadow-md'
                  : 'bg-[#10172a] text-slate-300 hover:text-white border border-white/10 hover:bg-[#18233d]'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Card>

      {/* Companies Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((company) => (
            <Card
              key={company.slug}
              hover
              className="p-6 flex flex-col justify-between group bg-[#141b30]/90 border-white/10 hover:border-purple-500/50 hover:bg-[#18233d]/90 transition-all duration-200"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-950/60 to-cyan-950/60 border border-white/15 flex items-center justify-center text-lg font-black text-white group-hover:border-purple-400 group-hover:scale-105 transition-all">
                    {company.name.charAt(0)}
                  </div>
                  <Badge variant={company.tier.includes('Tier 1') ? 'purple' : 'cyan'} size="sm">
                    {company.tier}
                  </Badge>
                </div>

                <div>
                  <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {company.name}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1.5 leading-relaxed line-clamp-3">
                    {company.overview}
                  </p>
                </div>

                {/* Focus Topics */}
                {company.dsaEmphasis?.length > 0 && (
                  <div className="pt-2 border-t border-white/10 space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                      Primary DSA Focus
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {company.dsaEmphasis.slice(0, 2).map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] font-mono px-2 py-0.5 rounded bg-[#0d1322] border border-white/10 text-cyan-300 truncate max-w-full"
                        >
                          {item.topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400">View hiring rounds</span>
                <Link to={`/companies/${company.slug}`}>
                  <Button size="sm" variant="secondary" icon={ChevronRight}>
                    Open Guide
                  </Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center text-xs text-slate-400">
          No companies found matching your search.
        </div>
      )}
    </div>
  );
};
