import React from 'react';
import { Menu, Sparkles, Search, Bell } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

export const Topbar = ({ onOpenMobile }) => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-[#1d1238] bg-[#090514]/90 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Left section: Mobile hamburger & Search bar with shortcut */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenMobile}
          className="md:hidden text-slate-400 hover:text-white p-2 rounded-xl hover:bg-purple-950/40 transition-colors"
          aria-label="Open navigation menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Input */}
        <div className="relative w-full max-w-md hidden sm:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
            <Search className="w-3.5 h-3.5" />
          </div>
          <input
            type="text"
            placeholder="Quick jump across DSA, company guides, or code..."
            className="w-full bg-[#110a22] border border-[#23143f] rounded-xl pl-9 pr-10 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500/30 transition-all"
          />
          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center pointer-events-none">
            <kbd className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#1b0f36] border border-purple-500/30 text-purple-300">
              ⌘K
            </kbd>
          </div>
        </div>
      </div>

      {/* Right section: Target Track Chip, Bell & Radiant CTA Button */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Target Track Chip */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#110a22] border border-[#23143f] text-xs">
          <span className="text-slate-400 font-mono text-[10px] uppercase">Target:</span>
          <span className="font-semibold text-slate-200 truncate max-w-[160px]">Google, Amazon, MS</span>
        </div>

        {/* Notification Bell */}
        <button
          className="relative p-2 text-slate-400 hover:text-white rounded-xl hover:bg-purple-950/40 transition-colors"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-pink-500 shadow-glow-magenta" />
        </button>

        {/* Primary Radiant CTA */}
        <Link
          to="/interview"
          className="btn-gradient-primary text-xs font-bold px-3.5 sm:px-4 py-2 rounded-xl shadow-lg shadow-purple-950 flex items-center gap-2 transition-all shrink-0"
        >
          <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
          <span>Start AI Practice</span>
        </Link>
      </div>
    </header>
  );
};
