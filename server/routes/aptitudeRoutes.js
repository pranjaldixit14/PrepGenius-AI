import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import {
  getQuestions,
  submitAttempt,
  getAttempts,
  deleteAttempt,
  clearAllAttempts,
} from '../controllers/aptitudeController.js';

const router = express.Router();

router.use(requireAuth);
router.get('/questions', getQuestions);
router.post('/attempts', submitAttempt);
router.get('/attempts', getAttempts);
router.delete('/attempts', clearAllAttempts);
router.delete('/attempts/:id', deleteAttempt);

export default router;

