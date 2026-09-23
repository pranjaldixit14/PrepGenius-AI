import express from 'express';
import { requireAuth } from '../middleware/authMiddleware.js';
import { getDashboardData } from '../controllers/dashboardController.js';

const router = express.Router();

router.use(requireAuth);
router.get('/', getDashboardData);

export default router;
