import React from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

// Layouts
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { DashboardPage } from './pages/DashboardPage';
import { ResumePage } from './pages/ResumePage';
import { DSAPage } from './pages/DSAPage';
import { DSADetailPage } from './pages/DSADetailPage';
import { AptitudePage } from './pages/AptitudePage';
import { AptitudeTestPage } from './pages/AptitudeTestPage';
import { InterviewPage } from './pages/InterviewPage';
import { InterviewSessionPage } from './pages/InterviewSessionPage';
import { CompaniesPage } from './pages/CompaniesPage';
import { CompanyDetailPage } from './pages/CompanyDetailPage';
import { ProfilePage } from './pages/ProfilePage';
import { Skeleton } from './components/common/Skeleton';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-8">
        <div className="space-y-4 w-full max-w-md text-center">
          <div className="w-10 h-10 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-400">Loading PrepGenius AI session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default function App() {
  return (
    <Routes>
      {/* Public Marketing & Auth */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />

      {/* Protected App Shell */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<DashboardPage />} />
        <Route path="resume" element={<ResumePage />} />
        <Route path="dsa" element={<DSAPage />} />
        <Route path="dsa/:identifier" element={<DSADetailPage />} />
        <Route path="aptitude" element={<AptitudePage />} />
        <Route path="aptitude/test" element={<AptitudeTestPage />} />
        <Route path="interview" element={<InterviewPage />} />
        <Route path="interview/session/:id" element={<InterviewSessionPage />} />
        <Route path="companies" element={<CompaniesPage />} />
        <Route path="companies/:identifier" element={<CompanyDetailPage />} />
        <Route path="profile" element={<ProfilePage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
