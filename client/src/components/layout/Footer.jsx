import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Shield, Terminal } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-white/10 bg-[#080d1a] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
        {/* Brand column */}
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-purple-600/30">
              <Sparkles className="w-4 h-4 stroke-[2.5]" />
            </div>
            <span className="font-extrabold text-base text-white">PrepGenius AI</span>
          </div>
          <p className="text-sm text-slate-300 max-w-md leading-relaxed">
            The intelligent placement preparation platform for engineers and fresh graduates. Unifying resume optimization, algorithmic problem-solving, aptitude, and AI-evaluated mock interviews.
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Shield className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>AI scores are platform guidance and do not represent official recruiter screening.</span>
          </div>
        </div>

        {/* Modules */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Modules</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/resume" className="hover:text-cyan-300 transition-colors">AI Resume Analyzer</Link></li>
            <li><Link to="/dsa" className="hover:text-cyan-300 transition-colors">DSA Practice Hub</Link></li>
            <li><Link to="/aptitude" className="hover:text-cyan-300 transition-colors">Aptitude Tests</Link></li>
            <li><Link to="/interview" className="hover:text-cyan-300 transition-colors">AI Mock Interview</Link></li>
            <li><Link to="/companies" className="hover:text-cyan-300 transition-colors">Company Guides</Link></li>
          </ul>
        </div>

        {/* Quick links */}
        <div>
          <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">Platform</h4>
          <ul className="space-y-2.5 text-sm text-slate-400">
            <li><Link to="/dashboard" className="hover:text-cyan-300 transition-colors">Candidate Dashboard</Link></li>
            <li><Link to="/profile" className="hover:text-cyan-300 transition-colors">Profile & Goals</Link></li>
            <li><Link to="/signup" className="hover:text-cyan-300 transition-colors">Create Free Account</Link></li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
        <p>© {new Date().getFullYear()} PrepGenius AI. Designed for engineering placement success.</p>
        <p className="flex items-center gap-1.5">
          <Terminal className="w-3.5 h-3.5 text-purple-400" /> Built for modern engineering graduates
        </p>
      </div>
    </footer>
  );
};
