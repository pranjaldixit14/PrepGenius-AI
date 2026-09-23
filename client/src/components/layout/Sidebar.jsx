import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FileText,
  Code2,
  BrainCircuit,
  MessageSquareCode,
  Building2,
  User,
  LogOut,
  Sparkles,
  Zap,
  Sliders,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, badge: null },
  { name: 'Resume Analyzer', path: '/resume', icon: FileText, badge: 'ATS: 84%', badgeColor: 'magenta' },
  { name: 'DSA Practice', path: '/dsa', icon: Code2, badge: '142 Solved', badgeColor: 'cyan' },
  { name: 'Aptitude Tests', path: '/aptitude', icon: BrainCircuit, badge: null },
  { name: 'AI Mock Interview', path: '/interview', icon: MessageSquareCode, badge: '4.2★', badgeColor: 'cyan' },
  { name: 'Company Guides', path: '/companies', icon: Building2, badge: null },
];

export const Sidebar = ({ isMobileOpen, onCloseMobile }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navContent = (
    <div className="flex flex-col h-full bg-[#090514] border-r border-[#1d1238] w-64 select-none">
      {/* Brand Header */}
      <div className="h-16 flex items-center justify-between px-5 border-b border-[#1d1238]">
        <NavLink to="/dashboard" className="flex items-center gap-2.5" onClick={onCloseMobile}>
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-purple-500 to-pink-500 flex items-center justify-center shadow-md shadow-purple-950 text-white">
            <Sparkles className="w-4 h-4 stroke-[2.5]" />
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-sm tracking-tight text-white">
              PrepGenius
            </span>
            <span className="text-[10px] text-purple-300 font-bold px-1.5 py-0.5 rounded bg-[#1a0e30] border border-purple-500/40">
              AI v2.4
            </span>
          </div>
        </NavLink>
        {isMobileOpen && (
          <button
            onClick={onCloseMobile}
            className="md:hidden text-slate-400 hover:text-white p-1 rounded-lg hover:bg-purple-950/50"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4">
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-[#7C6F9B] uppercase">
            Core Modules
          </div>
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all duration-150 group ${
                      isActive
                        ? 'bg-[#1a1033] text-white border border-purple-500/50 shadow-sm shadow-purple-900/30 font-semibold'
                        : 'text-[#9B8EB8] hover:text-white hover:bg-[#150c2b]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <div className="flex items-center gap-2.5 min-w-0">
                        <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-purple-400' : 'text-[#7C6F9B] group-hover:text-purple-300'}`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {isActive ? (
                        <span className="w-1.5 h-1.5 rounded-sm bg-fuchsia-400 shadow-glow-magenta shrink-0" />
                      ) : item.badge ? (
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono font-bold shrink-0 ${
                          item.badgeColor === 'cyan'
                            ? 'bg-[#08202d] text-cyan-300 border border-cyan-500/30'
                            : 'bg-[#230f36] text-fuchsia-300 border border-fuchsia-500/30'
                        }`}>
                          {item.badge}
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              );
            })}
          </div>
        </div>

        {/* Telemetry & Stats Section */}
        <div>
          <div className="px-3 pb-2 text-[10px] font-bold tracking-widest text-[#7C6F9B] uppercase">
            Telemetry & Stats
          </div>
          <div className="space-y-2.5 px-1">
            <div className="p-3 rounded-xl bg-[#110a22] border border-[#21143d] space-y-1.5">
              <div className="flex justify-between text-[11px] font-medium">
                <span className="text-slate-400">Placement Readiness</span>
                <span className="text-white font-mono font-bold">78/100</span>
              </div>
              <div className="w-full h-1.5 bg-[#1a0f33] rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 w-[78%] rounded-full shadow-sm" />
              </div>
            </div>

            <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#110a22] border border-[#21143d] text-xs">
              <div className="flex items-center gap-2 text-slate-300 font-medium">
                <Zap className="w-3.5 h-3.5 text-fuchsia-400 fill-fuchsia-400" />
                <span>14 Days Streak</span>
              </div>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-fuchsia-950 text-fuchsia-300 border border-fuchsia-500/40 tracking-wider">
                ACTIVE
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* User Quick Glance & Logout */}
      <div className="p-3 border-t border-[#1d1238] bg-[#090514]">
        <div className="flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl bg-[#110a22] border border-[#21143d]">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center font-bold text-xs text-white uppercase shadow-sm">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#090514]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Alex Vance'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.targetRole || "CS '26 • SDE-1"}</p>
            </div>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <Link
              to="/profile"
              className="p-1.5 text-slate-400 hover:text-white hover:bg-purple-950/50 rounded-lg transition-colors"
              title="Profile Settings"
            >
              <Sliders className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden md:flex flex-col shrink-0 h-screen sticky top-0">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-64 h-full shadow-2xl">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
};

