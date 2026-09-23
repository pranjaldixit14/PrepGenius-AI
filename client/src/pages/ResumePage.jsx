import React, { useState, useEffect, useRef } from 'react';
import {
  Upload,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Tag,
  Clock,
  ArrowUpRight,
  RefreshCw,
  Sparkles,
  AlertCircle
} from 'lucide-react';
import { resumeService } from '../services/resumeService';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { Skeleton } from '../components/common/Skeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ResumePage = () => {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [currentReport, setCurrentReport] = useState(null);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(true);
  const [error, setError] = useState('');

  const fileInputRef = useRef(null);
  const { showToast } = useToast();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setLoadingHistory(true);
      const res = await resumeService.getHistory();
      if (res?.success && res.resumes) {
        setHistory(res.resumes);
        if (res.resumes.length > 0 && !currentReport) {
          setCurrentReport(res.resumes[0]);
        }
      }
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleFileSelect = (selectedFile) => {
    setError('');
    if (!selectedFile) return;

    if (selectedFile.type !== 'application/pdf' && !selectedFile.name.toLowerCase().endsWith('.pdf')) {
      setError('Please select a valid PDF file (.pdf format only).');
      return;
    }

    if (selectedFile.size > 2 * 1024 * 1024) {
      setError('File size exceeds the 2 MB limit. Please upload a resume under 2 MB.');
      return;
    }

    setFile(selectedFile);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files[0]);
    }
  };

  const handleUploadAndAnalyze = async () => {
    if (!file) return;

    try {
      setUploading(true);
      setError('');
      setUploadProgress(20);

      const interval = setInterval(() => {
        setUploadProgress((prev) => (prev < 90 ? prev + 15 : prev));
      }, 400);

      const res = await resumeService.uploadResume(file, (progressEvent) => {
        const percent = Math.round((progressEvent.loaded * 100) / (progressEvent.total || 1));
        setUploadProgress(percent);
      });

      clearInterval(interval);
      setUploadProgress(100);

      if (res?.success && res.resume) {
        showToast('Resume analyzed successfully with Gemini!', 'success');
        setCurrentReport(res.resume);
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        fetchHistory();
      }
    } catch (err) {
      console.error('Resume upload error:', err);
      setError(err.message || 'Failed to analyze resume. Please try again.');
      showToast(err.message || 'Analysis failed', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-7">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">AI Resume Analyzer</h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            ATS scoring, role keyword gap analysis, and tailored engineering improvements.
          </p>
        </div>
        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Total Uploads:</span>
            <Badge variant="cyan">{history.length}</Badge>
          </div>
        )}
      </div>

      {/* Upload Zone & History Selector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Card (2 Cols) */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
                isDragging
                  ? 'border-purple-500 bg-purple-950/30'
                  : 'border-white/15 hover:border-purple-500/60 bg-[#0d1322]/60 hover:bg-[#12192c]'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                onChange={(e) => e.target.files && handleFileSelect(e.target.files[0])}
              />

              <div className="w-12 h-12 rounded-2xl bg-purple-950/60 text-purple-300 border border-purple-500/40 flex items-center justify-center mx-auto mb-3 shadow-md">
                <Upload className="w-6 h-6" />
              </div>

              <h4 className="text-sm font-bold text-white">
                {file ? file.name : 'Click to select or drag and drop your resume'}
              </h4>
              <p className="text-xs text-slate-400 mt-1">
                {file
                  ? `${(file.size / (1024 * 1024)).toFixed(2)} MB • Ready to analyze`
                  : 'Strictly PDF resumes only • Max 2 MB'}
              </p>
            </div>

            {error && (
              <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/50 text-rose-300 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{error}</span>
              </div>
            )}

            {uploading && (
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-xs text-slate-300">
                  <span className="flex items-center gap-1.5 font-semibold">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-purple-400" />
                    Extracting content & evaluating ATS benchmarks...
                  </span>
                  <span className="font-bold text-cyan-400">{uploadProgress}%</span>
                </div>
                <ProgressBar value={uploadProgress} color="purple" size="sm" showPercentage={false} />
              </div>
            )}

            {file && !uploading && (
              <div className="mt-4 flex items-center justify-between p-3.5 rounded-xl bg-[#10172a] border border-white/10">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-purple-400" />
                  <div>
                    <p className="text-xs font-bold text-white">{file.name}</p>
                    <p className="text-[11px] text-slate-400">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                </div>
                <Button size="sm" variant="primary" onClick={handleUploadAndAnalyze} icon={Sparkles}>
                  Analyze Resume
                </Button>
              </div>
            )}
          </Card>
        </div>

        {/* History List (1 Col) */}
        <div>
          <Card className="p-5 h-full flex flex-col">
            <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>Past Analyses</span>
            </h3>

            {loadingHistory ? (
              <div className="space-y-2">
                <Skeleton className="h-12 rounded-xl" />
                <Skeleton className="h-12 rounded-xl" />
              </div>
            ) : history.length > 0 ? (
              <div className="space-y-2 overflow-y-auto max-h-56 pr-1">
                {history.map((item) => (
                  <button
                    key={item._id || item.id}
                    onClick={() => setCurrentReport(item)}
                    className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between ${
                      currentReport?._id === item._id || currentReport?.id === item.id
                        ? 'bg-purple-950/70 border-purple-500/60 text-white font-semibold shadow-md'
                        : 'bg-[#10172a] border-white/10 hover:border-white/20 text-slate-300'
                    }`}
                  >
                    <div className="min-w-0 flex-1 pr-2">
                      <p className="font-bold truncate text-white">{item.fileName}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span className="font-bold font-mono px-2 py-1 rounded bg-[#16203a] border border-cyan-500/30 text-cyan-300">
                      {item.atsScore}/100
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 my-auto text-center">
                No past uploads yet. Upload your resume above.
              </p>
            )}
          </Card>
        </div>
      </div>

      {/* Structured Analysis Results Report */}
      {currentReport && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Report Header & Score Banner */}
          <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/95 backdrop-blur-xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2">
                <Badge variant="cyan" size="sm">Report Generated</Badge>
                <span className="text-xs text-slate-400 font-mono">
                  {new Date(currentReport.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {currentReport.fileName}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 max-w-lg">
                Evaluated against industry tech hiring benchmarks.
              </p>
            </div>

            {/* ATS Score Radial / Gauge */}
            <div className="flex items-center gap-4 bg-[#10172a] p-5 rounded-2xl border border-white/10 shrink-0 shadow-md">
              <div className="relative w-20 h-20 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-slate-700/60"
                    strokeWidth="3.5"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className={`transition-all duration-1000 ${
                      currentReport.atsScore >= 80
                        ? 'text-cyan-400'
                        : currentReport.atsScore >= 65
                        ? 'text-purple-400'
                        : 'text-amber-400'
                    }`}
                    strokeDasharray={`${currentReport.atsScore}, 100`}
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="none"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                </svg>
                <div className="absolute text-center">
                  <span className="text-xl font-black text-white">{currentReport.atsScore}</span>
                  <span className="block text-[9px] text-slate-400 uppercase font-bold">Score</span>
                </div>
              </div>

              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">ATS Rating</span>
                <p className="text-sm font-extrabold text-cyan-300 mt-0.5">
                  {currentReport.atsScore >= 80 ? 'Exceptional' : currentReport.atsScore >= 65 ? 'Competitive' : 'Needs Polish'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">Scale 0 - 100</p>
              </div>
            </div>
          </div>

          {/* 4 Report Sections: Strengths, Weaknesses, Missing Skills, Suggestions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Strengths */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-cyan-950/60 text-cyan-300 border border-cyan-500/30">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Identified Strengths</h4>
              </div>
              <ul className="space-y-2.5">
                {currentReport.strengths?.map((str, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="text-cyan-400 font-bold mt-0.5">✓</span>
                    <span className="leading-relaxed">{str}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Weaknesses */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-amber-950/60 text-amber-300 border border-amber-500/30">
                  <AlertTriangle className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Areas for Improvement</h4>
              </div>
              <ul className="space-y-2.5">
                {currentReport.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="text-amber-400 font-bold mt-0.5">▲</span>
                    <span className="leading-relaxed">{weak}</span>
                  </li>
                ))}
              </ul>
            </Card>

            {/* Missing Skills */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-purple-950/60 text-purple-300 border border-purple-500/30">
                  <Tag className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Recommended High-Impact Skills</h4>
              </div>
              <p className="text-xs text-slate-400">
                Key technical competencies to consider adding to your resume:
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                {currentReport.missingSkills?.map((skill, idx) => (
                  <Badge key={idx} variant="purple" size="md">
                    + {skill}
                  </Badge>
                ))}
              </div>
            </Card>

            {/* Actionable Suggestions */}
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2 pb-3 border-b border-white/[0.08]">
                <div className="p-2 rounded-xl bg-fuchsia-950/60 text-fuchsia-300 border border-fuchsia-500/30">
                  <Lightbulb className="w-5 h-5" />
                </div>
                <h4 className="text-base font-bold text-white">Actionable Steps</h4>
              </div>
              <ul className="space-y-2.5">
                {currentReport.suggestions?.map((sug, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                    <span className="text-fuchsia-400 mt-0.5 font-bold">→</span>
                    <span className="leading-relaxed">{sug}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};
