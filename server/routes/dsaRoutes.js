import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getQuestions, getQuestionDetail, updateProgress } from '../controllers/dsaController.js';

const router = express.Router();

router.use(requireAuth);
router.get('/questions', getQuestions);
router.get('/questions/:identifier', getQuestionDetail);
router.post('/progress', updateProgress);

export default router;
