import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const getPageMetadata = (pathname) => {
  if (pathname.startsWith('/resume')) {
    return { title: 'AI Resume Analyzer', subtitle: 'Upload your resume for structured ATS feedback and scoring' };
  }
  if (pathname.startsWith('/dsa/')) {
    return { title: 'Problem Solver', subtitle: 'Practice coding questions with hints and test cases' };
  }
  if (pathname.startsWith('/dsa')) {
    return { title: 'DSA Practice Hub', subtitle: 'Curated technical interview coding patterns & progress' };
  }
  if (pathname.startsWith('/aptitude/test')) {
    return { title: 'Aptitude Assessment', subtitle: 'Timed multiple-choice evaluation' };
  }
  if (pathname.startsWith('/aptitude')) {
    return { title: 'Aptitude Practice', subtitle: 'Quantitative, logical reasoning, and verbal tests' };
  }
  if (pathname.startsWith('/interview/session/')) {
    return { title: 'Live Mock Interview', subtitle: 'Interactive conversational session with AI evaluation' };
  }
  if (pathname.startsWith('/interview')) {
    return { title: 'AI Mock Interview', subtitle: 'Simulate realistic placement rounds with targeted critique' };
  }
  if (pathname.startsWith('/companies/')) {
    return { title: 'Company Preparation Guide', subtitle: 'Recruitment pattern, syllabus focus, and checklists' };
  }
  if (pathname.startsWith('/companies')) {
    return { title: 'Company Hub', subtitle: 'Targeted preparation for top product and service recruiters' };
  }
  if (pathname.startsWith('/profile')) {
    return { title: 'Candidate Profile', subtitle: 'Manage your placement targets, skills, and preferences' };
  }
  return { title: 'Dashboard', subtitle: 'Your personalized placement readiness and learning roadmap' };
};

export const DashboardLayout = () => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const { title, subtitle } = getPageMetadata(location.pathname);

  return (
    <div className="min-h-screen flex bg-[#0d1322] text-slate-100 selection:bg-purple-900 selection:text-white relative">
      {/* Sidebar: Normal flex width on desktop, collapsible drawer on mobile */}
      <Sidebar
        isMobileOpen={isMobileOpen}
        onCloseMobile={() => setIsMobileOpen(false)}
      />

      {/* Main App Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        <Topbar
          onOpenMobile={() => setIsMobileOpen(true)}
          title={title}
          subtitle={subtitle}
        />

        {/* Page View with responsive padding and centered container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
