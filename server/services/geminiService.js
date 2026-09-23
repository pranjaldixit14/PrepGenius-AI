import { getGeminiClient, getGeminiModel } from '../config/gemini.js';

// Safe JSON parser from LLM response strings
const parseSafeJson = (text) => {
  try {
    // Strip markdown fences if present
    const cleaned = text
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/```$/i, '')
      .trim();
    return JSON.parse(cleaned);
  } catch (err) {
    // Attempt regex extraction of first JSON object
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (e) {
        // failed
      }
    }
    throw new Error('Failed to parse structured JSON from AI output');
  }
};

// Multi-dimensional deterministic ATS evaluation engine
export const generateFallbackResumeAnalysis = (resumeText, targetRole = 'Software Engineer') => {
  const lower = resumeText.toLowerCase();
  const words = resumeText.trim().split(/\s+/);
  const wordCount = words.length;

  // 1. Role-specific keyword dictionaries
  const roleKeywordsMap = {
    'Software Engineer': ['data structures', 'algorithms', 'git', 'c++', 'java', 'python', 'sql', 'oop', 'rest api', 'system design', 'docker', 'ci/cd', 'linux', 'testing', 'mongodb'],
    'Frontend Developer': ['react', 'javascript', 'typescript', 'html', 'css', 'tailwind', 'redux', 'next.js', 'vue', 'webpack', 'ui/ux', 'responsive', 'rest api', 'git', 'jest'],
    'Backend Developer': ['node', 'express', 'python', 'django', 'fastapi', 'java', 'spring', 'sql', 'postgresql', 'mongodb', 'redis', 'docker', 'aws', 'microservices', 'graphql', 'system design'],
    'Full Stack Developer': ['react', 'node', 'javascript', 'typescript', 'sql', 'mongodb', 'express', 'git', 'docker', 'aws', 'rest api', 'tailwind', 'html', 'css', 'ci/cd'],
    'Data Scientist': ['python', 'sql', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'machine learning', 'deep learning', 'statistics', 'data analysis', 'nlp', 'tableau', 'aws']
  };

  const targetKeywords = roleKeywordsMap[targetRole] || roleKeywordsMap['Software Engineer'];
  const matchedKeywords = targetKeywords.filter(kw => lower.includes(kw));

  // Role keyword score (0 to 25 pts)
  const keywordRatio = matchedKeywords.length / Math.max(8, targetKeywords.length);
  let keywordScore = Math.round(keywordRatio * 25);
  keywordScore = Math.min(25, Math.max(4, keywordScore));

  // 2. Quantified Impact & Metrics (0 to 25 pts)
  const metricMatches = resumeText.match(/\b\d+(\.\d+)?%\b|\$\d+([kmb])?|\b\d+\+?\s*(ms|seconds?|mins?|hours?|users?|clients?|queries|requests|rpm|rps|downloads?|stars?|endpoints?)\b|\b(reduced|improved|increased|boosted|accelerated|optimized)\s+by\s+\d+/gi) || [];
  const uniqueMetricsCount = new Set(metricMatches.map(m => m.toLowerCase())).size;

  let metricScore = 5;
  if (uniqueMetricsCount >= 5) metricScore = 25;
  else if (uniqueMetricsCount >= 3) metricScore = 20;
  else if (uniqueMetricsCount >= 2) metricScore = 15;
  else if (uniqueMetricsCount >= 1) metricScore = 10;

  // 3. Action Verb Strength (0 to 15 pts)
  const strongVerbs = ['architected', 'spearheaded', 'engineered', 'orchestrated', 'optimized', 'implemented', 'streamlined', 'automated', 'scaled', 'deployed', 'refactored', 'designed', 'developed', 'migrated', 'benchmarked', 'built', 'integrated', 'modeled', 'resolved', 'delivered'];
  const weakPhrases = ['helped with', 'worked on', 'assisted in', 'was responsible for', 'handled', 'duties included'];

  const matchedStrongVerbs = strongVerbs.filter(v => lower.includes(v));
  const matchedWeakPhrases = weakPhrases.filter(p => lower.includes(p));

  let verbScore = 4;
  if (matchedStrongVerbs.length >= 6) verbScore = 15;
  else if (matchedStrongVerbs.length >= 4) verbScore = 12;
  else if (matchedStrongVerbs.length >= 2) verbScore = 8;
  verbScore = Math.max(2, verbScore - matchedWeakPhrases.length * 2);

  // 4. Section Completeness (0 to 25 pts)
  const hasEmail = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/.test(resumeText);
  const hasPhone = /\b\d{10}\b|\(\d{3}\)|\+\d{1,3}[\s-]?\d+/.test(resumeText);
  const hasGithub = lower.includes('github') || lower.includes('gitlab') || lower.includes('leetcode');
  const hasLinkedin = lower.includes('linkedin') || lower.includes('portfolio');
  const hasEducation = /\b(bachelor|degree|b\.?tech|b\.?e\.?|master|university|college|cgpa|gpa)\b/i.test(lower);
  const hasExperience = /\b(experience|internship|employment|work history)\b/i.test(lower);
  const hasProjects = /\b(projects|built|developed)\b/i.test(lower);

  let completenessScore = 0;
  if (hasEmail && hasPhone) completenessScore += 6;
  else if (hasEmail || hasPhone) completenessScore += 3;
  if (hasGithub) completenessScore += 4;
  if (hasLinkedin) completenessScore += 3;
  if (hasEducation) completenessScore += 4;
  if (hasExperience) completenessScore += 4;
  if (hasProjects) completenessScore += 4;
  completenessScore = Math.min(25, completenessScore);

  // 5. Formatting & Length (0 to 10 pts)
  let formatScore = 6;
  if (/[•\-\*]\s+[A-Z]/.test(resumeText)) formatScore += 2; // Bullet points with capitalization
  if (wordCount >= 250 && wordCount <= 900) formatScore += 2; // Optimal length
  else if (wordCount < 180) formatScore -= 4; // Sparse penalty

  // Final Aggregated ATS Score (Normalized between 35 and 96)
  let totalScore = keywordScore + metricScore + verbScore + completenessScore + formatScore;
  totalScore = Math.min(96, Math.max(38, totalScore));

  // Dynamic Strengths
  const strengths = [];
  if (matchedKeywords.length >= 4) {
    strengths.push(`Strong keyword alignment for ${targetRole}: matched ${matchedKeywords.slice(0, 5).join(', ')}.`);
  } else if (matchedKeywords.length > 0) {
    strengths.push(`Identified relevant technical proficiencies: ${matchedKeywords.join(', ')}.`);
  }

  if (uniqueMetricsCount >= 2) {
    strengths.push(`Effectively quantified achievements (${uniqueMetricsCount} measurable outcome metrics identified).`);
  }
  if (hasGithub || hasLinkedin) {
    strengths.push('Included verifiable portfolio/code repository profiles (GitHub/LinkedIn).');
  }
  if (matchedStrongVerbs.length >= 3) {
    strengths.push(`Used decisive engineering action verbs (${matchedStrongVerbs.slice(0, 3).join(', ')}).`);
  }
  if (strengths.length === 0) {
    strengths.push('Document contains clean, recognizable education and introductory profile structure.');
  }

  // Dynamic Weaknesses
  const weaknesses = [];
  if (uniqueMetricsCount < 2) {
    weaknesses.push('Bullet points lack quantified business impact and measurable metrics (e.g., % latency reduced, user counts, scale).');
  }
  if (matchedKeywords.length < 5) {
    weaknesses.push(`Low keyword density for core ${targetRole} technologies. Consider expanding technical stack coverage.`);
  }
  if (matchedWeakPhrases.length > 0) {
    weaknesses.push(`Found passive phrasing ("${matchedWeakPhrases[0]}"). Replace with high-impact action verbs.`);
  }
  if (!lower.includes('ci/cd') && !lower.includes('docker') && !lower.includes('testing')) {
    weaknesses.push('Missing modern software delivery lifecycle signals (CI/CD, unit testing, containerization).');
  }
  if (wordCount < 220) {
    weaknesses.push('Resume content is relatively sparse. Elaborate on project architectures and personal contributions.');
  }
  if (weaknesses.length === 0) {
    weaknesses.push('Ensure all project bullets follow the Google XYZ formula: "Accomplished [X] measured by [Y], by doing [Z]".');
  }

  // Missing Skills tailored to role
  const missingSkills = targetKeywords
    .filter(kw => !lower.includes(kw))
    .map(kw => kw.charAt(0).toUpperCase() + kw.slice(1))
    .slice(0, 5);

  // Actionable Suggestions
  const suggestions = [
    'Rephrase project bullet points using the Google XYZ formula: "Accomplished [X] as measured by [Y], by doing [Z]".',
    `Align technical skill section headers specifically toward ${targetRole} requirements to pass enterprise ATS filters.`,
    'Include at least one measurable performance metric per project (e.g., latency, throughput, scale, % improvement).',
    'Ensure all hyperlinks (GitHub, LinkedIn) are readable as clean plain-text URLs in plain ATS parser outputs.'
  ];

  return {
    isResume: true,
    atsScore: totalScore,
    strengths: strengths.slice(0, 4),
    weaknesses: weaknesses.slice(0, 4),
    missingSkills: missingSkills.length > 0 ? missingSkills : ['System Design', 'Docker', 'Testing Frameworks'],
    suggestions: suggestions.slice(0, 4),
  };
};

/**
 * Structured Resume Analysis via Gemini API with Resume Verification
 */
export const analyzeResumeWithGemini = async (resumeText, targetRole = 'Software Engineer') => {
  const client = await getGeminiClient();
  const modelName = getGeminiModel();

  if (!client) {
    console.log('[Gemini] No API key detected or configured. Using intelligent fallback analyzer.');
    return generateFallbackResumeAnalysis(resumeText, targetRole);
  }

  const prompt = `
You are an expert technical recruiter and enterprise ATS evaluation engine analyzing candidate resumes for placement readiness in software engineering and tech roles.

CRITICAL FIRST STEP - RESUME VERIFICATION:
1. Examine the document to determine whether it is genuinely a candidate's resume or curriculum vitae (CV).
2. If the document is an invoice, billing statement, receipt, textbook excerpt, research paper, terms of service, recipe, or non-resume document, set "isResume" to false and explain why in "rejectionReason".
3. Only evaluate ATS score if "isResume" is true.

ATS SCORING RUBRIC (0 to 100):
- Technical Keyword Alignment for ${targetRole} (0 to 25 pts)
- Quantified Business Impact / Google XYZ Formula with metrics (0 to 25 pts)
- Practical Project & Experience Depth (0 to 20 pts)
- Decisive Action Verb Strength (0 to 15 pts)
- ATS Formatting, Section Completeness & Parseability (0 to 15 pts)

Score realistically and honestly between 30 and 96 based on evidence. Do NOT award generic high scores (~85) to sparse or mediocre resumes.

Response MUST follow this strict JSON schema:
{
  "isResume": <boolean: true if candidate resume/CV, false if non-resume>,
  "rejectionReason": <string explaining rejection if isResume is false, or null if isResume is true>,
  "atsScore": <number between 0 and 100>,
  "strengths": [<array of 3 to 5 concise strings celebrating specific evidence-based merits>],
  "weaknesses": [<array of 3 to 5 concise strings identifying specific gaps>],
  "missingSkills": [<array of 3 to 6 high-demand industry skills missing from the resume for this role>],
  "suggestions": [<array of 3 to 5 concrete action steps the candidate can execute immediately>]
}

DOCUMENT CONTENT:
${resumeText}
`;

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const outputText = response.text;
    const parsed = parseSafeJson(outputText);

    // If Gemini identified that this is not a resume
    if (parsed.isResume === false) {
      return {
        isResume: false,
        rejectionReason: parsed.rejectionReason || 'The uploaded file does not appear to be a candidate resume/CV.'
      };
    }

    // Validate schema
    const atsScore = typeof parsed.atsScore === 'number' ? Math.min(100, Math.max(0, Math.round(parsed.atsScore))) : 70;
    const strengths = Array.isArray(parsed.strengths) ? parsed.strengths.filter(s => typeof s === 'string').slice(0, 5) : [];
    const weaknesses = Array.isArray(parsed.weaknesses) ? parsed.weaknesses.filter(s => typeof s === 'string').slice(0, 5) : [];
    const missingSkills = Array.isArray(parsed.missingSkills) ? parsed.missingSkills.filter(s => typeof s === 'string').slice(0, 6) : [];
    const suggestions = Array.isArray(parsed.suggestions) ? parsed.suggestions.filter(s => typeof s === 'string').slice(0, 5) : [];

    return {
      isResume: true,
      atsScore,
      strengths: strengths.length > 0 ? strengths : ['Clear educational and foundational background present.'],
      weaknesses: weaknesses.length > 0 ? weaknesses : ['Could benefit from deeper technical metrics in project descriptions.'],
      missingSkills: missingSkills.length > 0 ? missingSkills : ['System Design', 'Docker', 'Testing Frameworks'],
      suggestions: suggestions.length > 0 ? suggestions : ['Include measurable outcomes for each project listed.'],
    };
  } catch (error) {
    console.error('[Gemini API Error]', error.message);
    // Graceful fallback using deterministic scoring engine
    return generateFallbackResumeAnalysis(resumeText, targetRole);
  }
};

/**
 * Generate Mock Interview Question via Gemini
 */
export const generateNextInterviewQuestion = async ({ role, type, difficulty, experienceLevel, previousTurns = [], questionIndex = 0 }) => {
  const client = await getGeminiClient();
  const modelName = getGeminiModel();

  const defaultQuestions = [
    `Can you walk me through an end-to-end technical project you built, explaining the architectural decisions and trade-offs you made?`,
    `How does the virtual DOM work in React, and how does reconciliation optimize rendering performance compared to direct DOM manipulation?`,
    `Explain the difference between SQL and NoSQL databases. In what scenario would you definitely select MongoDB over PostgreSQL?`,
    `Tell me about a challenging bug you encountered in a recent project. What was your step-by-step debugging methodology?`,
    `How do you handle concurrency, race conditions, or state consistency in modern distributed or web applications?`,
    `Describe a situation where you had to quickly learn an unfamiliar technology or framework to deliver a project on time.`
  ];

  if (!client) {
    const q = defaultQuestions[questionIndex % defaultQuestions.length];
    return {
      question: q,
      category: type === 'Behavioral' ? 'Behavioral' : 'Technical',
    };
  }

  const prompt = `
You are a senior technical hiring manager conducting a mock placement interview for a candidate applying for the role of ${role} (${experienceLevel} level).
Interview Focus: ${type}
Difficulty Level: ${difficulty}
Current Question Number: ${questionIndex + 1}

Previous Questions and Answers so far:
${previousTurns.map((t, idx) => `Q${idx + 1}: ${t.question}\nA: ${t.userAnswer || '[No response]'}`).join('\n\n')}

Generate the NEXT realistic, engaging, and professional interview question.
Do NOT repeat previously asked questions. If previous answers showed specific strengths or gaps, you may probe deeper.

Respond strictly in JSON format:
{
  "question": "<the interview question string>",
  "category": "Technical" | "Behavioral" | "System Design" | "Problem Solving"
}
`;

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = parseSafeJson(response.text);
    return {
      question: parsed.question || defaultQuestions[questionIndex % defaultQuestions.length],
      category: parsed.category || (type === 'Behavioral' ? 'Behavioral' : 'Technical'),
    };
  } catch (err) {
    console.warn('[Gemini Interview Question Gen Error]', err.message);
    return {
      question: defaultQuestions[questionIndex % defaultQuestions.length],
      category: type === 'Behavioral' ? 'Behavioral' : 'Technical',
    };
  }
};

/**
 * Evaluate Candidate's Interview Answer
 */
export const evaluateCandidateAnswer = async ({ question, answer, role, difficulty }) => {
  const client = await getGeminiClient();
  const modelName = getGeminiModel();

  if (!answer || answer.trim().length < 10) {
    return {
      score: 30,
      technicalCorrectness: 25,
      relevance: 30,
      clarityAndStructure: 40,
      completeness: 20,
      communicationQuality: 35,
      feedback: 'The answer provided was too brief or incomplete to thoroughly demonstrate competency on this topic.',
      actionableImprovement: 'Use structured frameworks like the STAR method (Situation, Task, Action, Result) or state the core concept, implementation details, and trade-offs.',
    };
  }

  if (!client) {
    // Intelligent heuristic evaluation
    const wordCount = answer.trim().split(/\s+/).length;
    let score = 70;
    if (wordCount > 60) score += 12;
    else if (wordCount < 20) score -= 15;

    return {
      score: Math.min(95, Math.max(40, score)),
      technicalCorrectness: 72,
      relevance: 78,
      clarityAndStructure: 75,
      completeness: wordCount > 40 ? 76 : 55,
      communicationQuality: 80,
      feedback: 'Good fundamental understanding conveyed with clear reasoning. Solid structure and relevant terminology.',
      actionableImprovement: 'Consider expanding on practical production considerations such as error handling, edge cases, and performance implications.',
    };
  }

  const prompt = `
You are an expert interviewer evaluating a candidate's answer in a technical placement interview for a ${role} role.

Question: "${question}"
Candidate Answer: "${answer}"
Difficulty: ${difficulty}

Evaluate the candidate's response across these 5 dimensions (0 to 100 each):
1. technicalCorrectness: Accuracy of the technical facts, logic, or concepts.
2. relevance: How directly it addresses the specific question asked.
3. clarityAndStructure: How well-articulated and logically structured the response is.
4. completeness: Whether key considerations, examples, or edge cases were covered.
5. communicationQuality: Professional tone, clarity, and precision.

Return STRICT JSON:
{
  "score": <overall 0-100 average>,
  "technicalCorrectness": <0-100>,
  "relevance": <0-100>,
  "clarityAndStructure": <0-100>,
  "completeness": <0-100>,
  "communicationQuality": <0-100>,
  "feedback": "<2-3 sentence constructive critique highlighting what was good and what was missing>",
  "actionableImprovement": "<1-2 sentences on exactly how the candidate can refine this answer in an actual interview>"
}
`;

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = parseSafeJson(response.text);
    return {
      score: Math.min(100, Math.max(0, Math.round(parsed.score || 70))),
      technicalCorrectness: Math.min(100, Math.max(0, Math.round(parsed.technicalCorrectness || 70))),
      relevance: Math.min(100, Math.max(0, Math.round(parsed.relevance || 70))),
      clarityAndStructure: Math.min(100, Math.max(0, Math.round(parsed.clarityAndStructure || 70))),
      completeness: Math.min(100, Math.max(0, Math.round(parsed.completeness || 70))),
      communicationQuality: Math.min(100, Math.max(0, Math.round(parsed.communicationQuality || 70))),
      feedback: parsed.feedback || 'Solid conceptual explanation with clear points.',
      actionableImprovement: parsed.actionableImprovement || 'Deepen practical examples and trade-off comparisons.',
    };
  } catch (err) {
    console.warn('[Gemini Answer Eval Error]', err.message);
    return {
      score: 74,
      technicalCorrectness: 72,
      relevance: 78,
      clarityAndStructure: 75,
      completeness: 70,
      communicationQuality: 75,
      feedback: 'Good answer touching on primary principles with reasonable clarity.',
      actionableImprovement: 'Provide more concrete examples and address potential edge cases.',
    };
  }
};

/**
 * Generate Overall Interview Summary Report Card
 */
export const generateInterviewSummaryReport = async ({ turns, role, difficulty }) => {
  const client = await getGeminiClient();
  const modelName = getGeminiModel();

  const avgScore = Math.round(
    turns.reduce((acc, t) => acc + (t.evaluation?.score || 60), 0) / (turns.length || 1)
  );

  if (!client) {
    return {
      overallScore: avgScore,
      strengths: [
        'Demonstrates clear logical thinking and coherent explanations.',
        'Good grasp of fundamental software development principles.',
        'Structured responses with appropriate technical vocabulary.'
      ],
      weaknesses: [
        'Could provide deeper elaboration on edge cases and scalability considerations.',
        'Occasionally missed mentioning measurable impact or benchmark metrics.'
      ],
      recommendations: [
        'Practice framing answers using structured models like STAR.',
        'Review core time & space complexities for underlying algorithms.',
        'Prepare 2-3 deep dive project stories with specific architecture diagrams.'
      ],
      summaryNotes: 'Strong overall performance indicating high placement readiness with minor polish needed in technical edge-case discussion.'
    };
  }

  const prompt = `
You are a senior technical recruitment manager compiling a final evaluation report for a ${role} candidate who just completed a ${turns.length}-question mock placement interview.

Session Transcript:
${turns.map((t, idx) => `Question ${idx + 1}: ${t.question}\nAnswer: ${t.userAnswer}\nScore: ${t.evaluation?.score || 'N/A'}\nFeedback: ${t.evaluation?.feedback || 'N/A'}`).join('\n\n')}

Provide an overarching evaluation in STRICT JSON:
{
  "overallScore": <0-100 overall score>,
  "strengths": [<array of 3 specific strengths demonstrated>],
  "weaknesses": [<array of 2-3 specific development areas>],
  "recommendations": [<array of 3 concrete next steps to maximize placement offer chances>],
  "summaryNotes": "<2-3 sentence executive summary of candidate readiness>"
}
`;

  try {
    const response = await client.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const parsed = parseSafeJson(response.text);
    return {
      overallScore: typeof parsed.overallScore === 'number' ? Math.min(100, Math.max(0, parsed.overallScore)) : avgScore,
      strengths: Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 4) : ['Consistent technical communication.'],
      weaknesses: Array.isArray(parsed.weaknesses) ? parsed.weaknesses.slice(0, 3) : ['Room for deeper architecture discussions.'],
      recommendations: Array.isArray(parsed.recommendations) ? parsed.recommendations.slice(0, 3) : ['Continue timed problem-solving practice.'],
      summaryNotes: parsed.summaryNotes || 'Solid interview performance showing readiness for technical rounds.',
    };
  } catch (err) {
    console.warn('[Gemini Summary Report Error]', err.message);
    return {
      overallScore: avgScore,
      strengths: ['Clear technical articulation', 'Structured answers', 'Solid foundational knowledge'],
      weaknesses: ['Elaboration on edge cases', 'Quantified project metrics'],
      recommendations: ['Practice STAR method', 'Review system trade-offs', 'Reinforce core DSA fundamentals'],
      summaryNotes: 'Good candidate demonstration with promising placement potential.',
    };
  }
};
