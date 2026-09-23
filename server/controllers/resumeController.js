import mongoose from 'mongoose';
import fs from 'fs';
import Resume from '../models/Resume.js';
import { extractTextFromPdf, validateResumeContent } from '../services/pdfService.js';
import { analyzeResumeWithGemini } from '../services/geminiService.js';
import { memoryStore } from '../services/memoryStore.js';

const isDbConnected = () => mongoose.connection.readyState === 1;

export const uploadAndAnalyze = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF resume file was uploaded.',
      });
    }

    const userId = req.user._id || req.user.id;
    const targetRole = req.user.targetRole || 'Software Engineer';
    const filePath = req.file.path;
    const fileName = req.file.originalname;
    const fileSize = req.file.size;

    // Step 1: Extract text safely
    let extractedText = '';
    try {
      extractedText = await extractTextFromPdf(filePath);
    } catch (extractError) {
      // Clean up uploaded file
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: extractError.message || 'Could not parse text from this PDF file.',
      });
    }

    // Step 2: Structural Resume Verification
    const validation = validateResumeContent(extractedText);
    if (!validation.isValid) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: validation.reason || 'The uploaded file does not appear to be a candidate resume. Please upload a valid professional resume.',
      });
    }

    // Step 3: AI Analysis with Gemini (with fallback)
    const aiAnalysis = await analyzeResumeWithGemini(extractedText, targetRole);

    // AI Resume Verification check
    if (aiAnalysis && aiAnalysis.isResume === false) {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return res.status(400).json({
        success: false,
        message: aiAnalysis.rejectionReason || 'The uploaded document was identified as a non-resume file. Please upload a valid candidate resume.',
      });
    }

    // Step 3: Validate and sanitize AI output before saving
    const sanitizedRecord = {
      user: userId,
      fileName,
      filePath,
      fileSize,
      extractedText: extractedText.substring(0, 5000), // Keep snippet for audit
      atsScore: Math.min(100, Math.max(0, Math.round(aiAnalysis.atsScore || 65))),
      strengths: Array.isArray(aiAnalysis.strengths) ? aiAnalysis.strengths.slice(0, 5) : [],
      weaknesses: Array.isArray(aiAnalysis.weaknesses) ? aiAnalysis.weaknesses.slice(0, 5) : [],
      missingSkills: Array.isArray(aiAnalysis.missingSkills) ? aiAnalysis.missingSkills.slice(0, 6) : [],
      suggestions: Array.isArray(aiAnalysis.suggestions) ? aiAnalysis.suggestions.slice(0, 5) : [],
    };

    // Step 4: Persist in MongoDB or memoryStore
    let savedResume;
    if (isDbConnected()) {
      savedResume = await Resume.create(sanitizedRecord);
    } else {
      savedResume = memoryStore.saveResume(sanitizedRecord);
    }

    return res.status(201).json({
      success: true,
      message: 'Resume analyzed successfully.',
      resume: savedResume,
    });
  } catch (error) {
    next(error);
  }
};

export const getResumeHistory = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbConnected()) {
      const resumes = await Resume.find({ user: userId })
        .sort({ createdAt: -1 })
        .select('-extractedText');
      return res.json({ success: true, count: resumes.length, resumes });
    } else {
      const resumes = memoryStore.getUserResumes(userId).map(({ extractedText: _, ...rest }) => rest);
      return res.json({ success: true, count: resumes.length, resumes });
    }
  } catch (error) {
    next(error);
  }
};

export const getResumeById = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    const { id } = req.params;

    let resume = null;
    if (isDbConnected()) {
      resume = await Resume.findById(id);
    } else {
      resume = memoryStore.resumes.find(r => String(r._id) === String(id) || String(r.id) === String(id));
    }

    if (!resume) {
      return res.status(404).json({ success: false, message: 'Resume analysis report not found.' });
    }

    // Strict ownership verification
    const ownerId = String(resume.user?._id || resume.user);
    if (ownerId !== String(userId)) {
      return res.status(403).json({ success: false, message: 'Access denied. You do not own this report.' });
    }

    return res.json({ success: true, resume });
  } catch (error) {
    next(error);
  }
};
