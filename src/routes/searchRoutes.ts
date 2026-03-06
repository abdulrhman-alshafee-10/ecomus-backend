import { Router } from 'express';
import { search } from '../controllers/searchController';

const router = Router();

// GET /api/search?q=term&type=products|categories|blogs&page=1&limit=12
router.get('/', search);

export default router;
