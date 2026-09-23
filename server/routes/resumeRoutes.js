import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { uploadResume } from '../middleware/uploadMiddleware.js';
import { uploadAndAnalyze, getResumeHistory, getResumeById } from '../controllers/resumeController.js';

const router = express.Router();

router.use(requireAuth);
router.post('/upload', uploadResume.single('resume'), uploadAndAnalyze);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeById);

export default router;
