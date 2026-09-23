import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Code2,
  Search,
  CheckCircle2,
  Bookmark,
  ChevronRight,
  Filter,
  Sparkles,
  ArrowUpDown
} from 'lucide-react';
import { dsaService } from '../services/dsaService';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Button } from '../components/common/Button';
import { Skeleton } from '../components/common/Skeleton';
import { ProgressBar } from '../components/common/ProgressBar';

const TOPICS = [
  'All',
  'Arrays',
  'Strings',
  'Hashing',
  'Two Pointers',
  'Sliding Window',
  'Linked List',
  'Stack',
  'Binary Tree',
  'Dynamic Programming',
  'Graphs',
];

const DIFFICULTIES = ['All', 'Easy', 'Medium', 'Hard'];

export const DSAPage = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTopic, setSelectedTopic] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchQuestions();
  }, [selectedTopic, selectedDifficulty]);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await dsaService.getQuestions({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
      });
      if (res?.success) {
        setQuestions(res.questions);
      }
    } catch (err) {
      console.error('Failed to fetch questions:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter((q) => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return q.title.toLowerCase().includes(term) || q.topics.some((t) => t.toLowerCase().includes(term));
  });

  const solvedCount = questions.filter((q) => q.status === 'Solved').length;
  const progressPercent = questions.length > 0 ? Math.round((solvedCount / questions.length) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress Header */}
      <div className="p-6 sm:p-8 rounded-3xl border border-white/10 bg-[#141b30]/95 backdrop-blur-xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950/60 border border-purple-500/40 text-purple-300 text-xs font-semibold mb-2">
            <Code2 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Placement Coding Patterns</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            DSA Practice Hub
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            High-frequency problem patterns frequently tested in technical rounds at Google, Amazon, and tier-1 companies.
          </p>
        </div>

        {/* Progress pill */}
        <div className="p-4 rounded-2xl bg-[#10172a] border border-white/10 shrink-0 w-full sm:w-64 shadow-md">
          <div className="flex justify-between text-xs text-slate-300 mb-1.5 font-medium">
            <span>Overall Progress</span>
            <span className="text-cyan-400 font-bold font-mono">{solvedCount} / {questions.length} Solved</span>
          </div>
          <ProgressBar value={solvedCount} max={questions.length || 1} color="purple" showPercentage={false} />
        </div>
      </div>

      {/* Filter Bar */}
      <Card className="p-4 space-y-4">
        {/* Search & Difficulty Filter */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search questions by title or topic..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#10172a] border border-white/15 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto shrink-0 pb-1 sm:pb-0">
            {DIFFICULTIES.map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white font-bold shadow-md'
                    : 'bg-[#10172a] text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/40'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 pb-1">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => setSelectedTopic(topic)}
              className={`px-3 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedTopic === topic
                  ? 'bg-purple-950/80 text-cyan-300 border border-purple-500/50 font-bold'
                  : 'bg-[#10172a] text-slate-300 hover:text-white border border-white/10 hover:border-purple-500/30'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </Card>

      {/* Questions Table / List */}
      <Card className="overflow-hidden">
        {loading ? (
          <div className="p-6 space-y-3">
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
            <Skeleton className="h-12 w-full rounded-xl" />
          </div>
        ) : filteredQuestions.length > 0 ? (
          <div className="divide-y divide-white/[0.06]">
            {filteredQuestions.map((q, idx) => (
              <div
                key={q._id || q.slug}
                className="p-4 sm:p-5 bg-[#12192c]/50 hover:bg-[#18233d] flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 group"
              >
                <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                  <span className="text-xs font-mono font-bold text-purple-400 w-8 shrink-0">
                    #{idx + 1}
                  </span>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2.5">
                      <Link
                        to={`/dsa/${q.slug}`}
                        className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors tracking-tight"
                      >
                        {q.title}
                      </Link>
                      {q.isBookmarked && (
                        <Bookmark className="w-4 h-4 text-amber-400 fill-amber-400 shrink-0" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <Badge
                        variant={
                          q.difficulty === 'Easy'
                            ? 'emerald'
                            : q.difficulty === 'Medium'
                            ? 'amber'
                            : 'rose'
                        }
                        size="sm"
                      >
                        {q.difficulty}
                      </Badge>
                      {q.topics.slice(0, 3).map((topic) => (
                        <span
                          key={topic}
                          className="text-xs text-slate-200 bg-[#0d1322] px-2.5 py-0.5 rounded-lg border border-white/10 font-medium"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 shrink-0">
                  <Badge
                    variant={
                      q.status === 'Solved'
                        ? 'emerald'
                        : q.status === 'Attempted'
                        ? 'amber'
                        : 'slate'
                    }
                    size="sm"
                  >
                    {q.status === 'Solved' ? '✓ Solved' : q.status}
                  </Badge>

                  <Link to={`/dsa/${q.slug}`}>
                    <Button size="sm" variant="secondary" icon={ChevronRight}>
                      Solve Problem
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-xs text-slate-400">
            No questions match your current filters.
          </div>
        )}
      </Card>
    </div>
  );
};
