import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { createSession, submitAnswer, getSession, getSessions } from '../controllers/interviewController.js';

const router = express.Router();

router.use(requireAuth);
router.post('/session', createSession);
router.post('/answer', submitAnswer);
router.get('/session/:id', getSession);
router.get('/sessions', getSessions);

export default router;
