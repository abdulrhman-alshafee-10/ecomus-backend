import { Router } from 'express';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { getStats } from '../controllers/statsController';

const router = Router();

router.get('/', protect, isAdmin, getStats);

export default router;
