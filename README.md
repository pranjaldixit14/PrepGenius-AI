# PrepGenius AI - AI-Powered Placement Preparation Platform

> A full-stack, SaaS-grade placement preparation web application built for engineering students and fresh graduates. Unifying ATS Resume Optimization, Curated DSA Problem Solving, Timed Aptitude Speed Tests, Adaptive AI Mock Interviews, Company-Specific Preparation, and Real-Time Readiness Analytics.

---

## 🌟 Core Features

- **AI Resume Analyzer**:
  - Drag-and-drop PDF resume upload (up to 5MB, strict MIME & extension validation).
  - Text extraction and sanitization with prompt-injection defenses.
  - Gemini AI analysis returning structured JSON: ATS score (0-100), strengths, areas for improvement, missing high-demand technical skills, and actionable suggestions.
  - Historical comparison of past resume uploads.

- **DSA Practice Hub**:
  - Curated pattern questions covering Arrays, Strings, Two Pointers, Sliding Window, Linked Lists, Binary Trees, and Dynamic Programming.
  - Filter by difficulty (Easy, Medium, Hard), topic, and instant search.
  - Problem workspace with statement, examples, constraints, collapsible hints, and interactive multi-language code editor stub (JavaScript, Python, C++, Java).
  - Per-user status tracking (`Not Started`, `Attempted`, `Solved`) and bookmarks.

- **Aptitude Practice**:
  - Test question bank across Quantitative Aptitude, Logical Reasoning, and Verbal Ability.
  - Timed testing mode with countdown timer, question palette navigation, mark for review, and instant grading.
  - Post-submission analytics with topic accuracy breakdown, negative marking computation, and detailed step-by-step explanations.

- **AI Mock Interview Module**:
  - Configurable sessions by target role, interview focus (Technical, Behavioral, Mixed), difficulty, and question count.
  - Turn-by-turn conversational questions generated and adapted by Gemini.
  - Multi-dimensional answer evaluation: Technical Correctness, Relevance, Clarity & Structure, Completeness, and Communication Quality.
  - Comprehensive final report card with executive summary notes and targeted recommendations.

- **Company Preparation Guides**:
  - Curated recruitment patterns and syllabus breakdowns for top product and service recruiters (Google, Amazon, Microsoft, TCS, Infosys).
  - DSA topic weightage bars, core CS subjects, and interactive preparation checklists.

- **Dashboard & Learning Analytics**:
  - Composite Placement Readiness Index (0-100) reflecting weighted progress across all modules.
  - Dynamic personalized next actions recommending high-leverage practice based on identified skill gaps.
  - Unified recent activity audit feed.

- **Modern Dark SaaS UI**:
  - Deep slate dark background (`#070b12`, `#0b1120`) with restrained cyan and blue accents.
  - Accessible contrast, clear hierarchy, responsive layout with non-overlapping desktop persistent flex sidebar and mobile collapsible drawer.

---

## 🛠️ Tech Stack

- **Frontend (`/client`)**:
  - React 18 + Vite
  - React Router v6
  - Tailwind CSS
  - Lucide React (Icons)
  - Axios (with centralized JWT auth interceptor)
  - Canvas Confetti

- **Backend (`/server`)**:
  - Node.js + Express.js (ES Modules)
  - MongoDB + Mongoose (with automated resilient in-memory fallback for zero-setup execution)
  - JSON Web Tokens (JWT) + bcryptjs password hashing
  - Multer (PDF restricted upload) + `pdf-parse`
  - `@google/genai` (Current official Google GenAI SDK with configurable `GEMINI_MODEL`)

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js** v18 or newer
- **npm** or **yarn**
- (Optional) **MongoDB** instance running locally or via MongoDB Atlas. *(The backend automatically falls back to a high-fidelity in-memory store if MongoDB is offline).*
- (Optional) **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/). *(The backend automatically includes an intelligent heuristic analyzer fallback if no key is configured).*

### 2. Installation
From the project root directory:

```bash
# Install root orchestration dependencies
npm install

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Environment Variables Configuration
The server comes pre-configured with default values in `server/.env`. You can update it with your own Gemini API key or MongoDB connection:

```env
PORT=5000
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://127.0.0.1:27017/prepgenius
JWT_SECRET=prepgenius_jwt_secret_dev_key_super_secure_2026
GEMINI_API_KEY=your_gemini_api_key_here
GEMINI_MODEL=gemini-2.5-flash
```

### 4. Running the Application

You can run both client and server concurrently from the root directory:

```bash
npm run dev
```

Or run them individually in separate terminals:

```bash
# Terminal 1 - Backend Server
cd server
npm run dev

# Terminal 2 - Frontend Client
cd client
npm run dev
```

The frontend will be available at: **http://localhost:5173**
The backend API will be available at: **http://localhost:5000/api**

---

## 🔑 Demo Account
A quick **"Auto-fill demo credentials"** button is available on the login page:
- **Email:** `candidate@prepgenius.ai`
- **Password:** `prepgenius2026`

Or register any new account on `/signup`.

---

## 📂 Project Structure

```
prepgenius-ai/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/        # Button, Input, Card, Badge, Modal, StatCard, ProgressBar, etc.
│   │   │   └── layout/        # DashboardLayout, Sidebar, Topbar, PublicNavbar, Footer
│   │   ├── context/           # AuthContext, ToastContext
│   │   ├── pages/             # Landing, Login, Signup, Dashboard, Resume, DSA, Aptitude, Interview, Companies, Profile
│   │   ├── services/          # api.js, authService, resumeService, dsaService, aptitudeService, interviewService, etc.
│   │   ├── App.jsx            # Routing and protected route configuration
│   │   └── main.jsx
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/
│   ├── config/                # Database and Gemini SDK client setup
│   ├── controllers/           # Auth, Profile, Dashboard, Resume, DSA, Aptitude, Interview, Companies
│   ├── middleware/            # JWT auth, Multer PDF validation, centralized error handling
│   ├── models/                # User, Resume, CodingQuestion, CodingProgress, AptitudeQuestion, Attempt, Interview, Company
│   ├── routes/                # Express API endpoints
│   ├── services/              # geminiService, pdfService, memoryStore fallback
│   ├── seed/                  # High-quality question banks and company profiles seed data
│   ├── server.js              # Express app entrypoint
│   └── package.json
└── README.md
```

---

## 🛡️ Security & Reliability Architecture
1. **Resume Text As Untrusted Data**: Resumes are treated strictly as data, never as system instructions.
2. **File Validation**: Strict MIME type checking (`application/pdf`) and file extension matching with a 5MB size limit.
3. **No Credential Leaks**: Stack traces and internal provider details are stripped from client responses.
4. **Resilient Architecture**: Zero application crashes if external AI services or MongoDB are temporarily unavailable.
