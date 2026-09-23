import { codingQuestionsSeed, aptitudeQuestionsSeed, companiesSeed } from '../seed/seedData.js';

/**
 * In-memory resilient storage for environments without local MongoDB
 */
class MemoryStore {
  constructor() {
    this.users = new Map();
    this.resumes = [];
    this.codingQuestions = codingQuestionsSeed.map((q, idx) => ({ ...q, _id: `cq_${idx + 1}` }));
    this.codingProgress = new Map(); // key: `${userId}:${questionId}`
    this.aptitudeQuestions = aptitudeQuestionsSeed.map((q, idx) => ({ ...q, _id: `aq_${idx + 1}` }));
    this.aptitudeAttempts = [];
    this.interviewSessions = [];
    this.companies = companiesSeed.map((c, idx) => ({ ...c, _id: `co_${idx + 1}` }));
  }

  // Users
  findUserByEmail(email) {
    for (const u of this.users.values()) {
      if (u.email.toLowerCase() === email.toLowerCase()) return u;
    }
    return null;
  }

  findUserById(id) {
    return this.users.get(String(id)) || null;
  }

  saveUser(user) {
    const id = user._id ? String(user._id) : `u_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const record = { ...user, _id: id, id };
    this.users.set(id, record);
    return record;
  }

  // Resumes
  saveResume(resume) {
    const id = `res_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`;
    const record = { ...resume, _id: id, id, createdAt: new Date().toISOString() };
    this.resumes.unshift(record);
    return record;
  }

  getUserResumes(userId) {
    return this.resumes.filter(r => String(r.user) === String(userId) || String(r.user?._id) === String(userId));
  }

  // Coding Questions & Progress
  getCodingQuestions(filters = {}) {
    let list = [...this.codingQuestions];
    if (filters.difficulty && filters.difficulty !== 'All') {
      list = list.filter(q => q.difficulty.toLowerCase() === filters.difficulty.toLowerCase());
    }
    if (filters.topic && filters.topic !== 'All') {
      list = list.filter(q => q.topics.includes(filters.topic));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(item => item.title.toLowerCase().includes(q) || item.statement.toLowerCase().includes(q));
    }
    return list;
  }

  getCodingQuestionByIdOrSlug(identifier) {
    return this.codingQuestions.find(q => String(q._id) === String(identifier) || q.slug === identifier) || null;
  }

  saveCodingProgress(userId, questionId, update) {
    const key = `${userId}:${questionId}`;
    const existing = this.codingProgress.get(key) || {
      _id: `cp_${Date.now()}`,
      user: userId,
      question: questionId,
      status: 'Not Started',
      isBookmarked: false,
      attempts: 0,
    };

    const updated = {
      ...existing,
      ...update,
      attempts: (existing.attempts || 0) + 1,
      updatedAt: new Date().toISOString(),
    };
    if (update.status === 'Solved') {
      updated.solvedAt = new Date().toISOString();
    }
    this.codingProgress.set(key, updated);
    return updated;
  }

  getUserCodingProgress(userId) {
    const result = [];
    for (const [key, prog] of this.codingProgress.entries()) {
      if (key.startsWith(`${userId}:`)) {
        result.push(prog);
      }
    }
    return result;
  }

  // Aptitude
  getAptitudeQuestions(category, difficulty, limit = 10) {
    let list = [...this.aptitudeQuestions];
    if (category && category !== 'Mixed' && category !== 'All') {
      const lower = category.toLowerCase().trim();
      let targetCat = category;
      if (lower.startsWith('quant')) targetCat = 'Quantitative';
      else if (lower.startsWith('logic')) targetCat = 'Logical reasoning';
      else if (lower.startsWith('verbal') || lower.startsWith('english')) targetCat = 'Verbal ability';
      else if (lower.includes('core') || lower.includes('cs') || lower.includes('tech')) targetCat = 'Core CS';

      const filtered = list.filter(q => q.category.toLowerCase() === targetCat.toLowerCase());
      if (filtered.length > 0) {
        list = filtered;
      }
    }
    if (difficulty && difficulty !== 'Mixed' && difficulty !== 'All') {
      const diffFiltered = list.filter(q => q.difficulty.toLowerCase() === difficulty.toLowerCase());
      if (diffFiltered.length > 0) {
        list = diffFiltered;
      }
    }
    // Shuffle and pick limit
    list = list.sort(() => 0.5 - Math.random());
    return list.slice(0, Number(limit));
  }

  saveAptitudeAttempt(attempt) {
    const id = `att_${Date.now()}`;
    const record = { ...attempt, _id: id, id, createdAt: new Date().toISOString() };
    this.aptitudeAttempts.unshift(record);
    return record;
  }

  getUserAptitudeAttempts(userId) {
    return this.aptitudeAttempts.filter(a => String(a.user) === String(userId) || String(a.user?._id) === String(userId));
  }

  deleteAptitudeAttempt(attemptId, userId) {
    this.aptitudeAttempts = this.aptitudeAttempts.filter(
      a => !(String(a._id) === String(attemptId) && (String(a.user) === String(userId) || String(a.user?._id) === String(userId)))
    );
  }

  clearUserAptitudeAttempts(userId) {
    this.aptitudeAttempts = this.aptitudeAttempts.filter(
      a => !(String(a.user) === String(userId) || String(a.user?._id) === String(userId))
    );
  }

  // Interviews
  saveInterviewSession(session) {
    const id = session._id ? String(session._id) : `iv_${Date.now()}`;
    const record = { ...session, _id: id, id, createdAt: new Date().toISOString() };
    const idx = this.interviewSessions.findIndex(s => String(s._id) === id);
    if (idx >= 0) {
      this.interviewSessions[idx] = record;
    } else {
      this.interviewSessions.unshift(record);
    }
    return record;
  }

  getInterviewSessionById(id) {
    return this.interviewSessions.find(s => String(s._id) === String(id)) || null;
  }

  getUserInterviewSessions(userId) {
    return this.interviewSessions.filter(s => String(s.user) === String(userId) || String(s.user?._id) === String(userId));
  }

  // Companies
  getCompanies() {
    return [...this.companies];
  }

  getCompanyBySlugOrId(identifier) {
    return this.companies.find(c => String(c._id) === String(identifier) || c.slug === identifier) || null;
  }
}

export const memoryStore = new MemoryStore();
