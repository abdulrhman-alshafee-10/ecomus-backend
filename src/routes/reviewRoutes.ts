import { Router } from 'express';
import {
    getReviews,
    createReview,
    updateReview,
    deleteReview,
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createReviewSchema, updateReviewSchema } from '../validators/reviewValidators';

const router = Router();

router.get('/', getReviews);
router.post('/', protect, validate(createReviewSchema), createReview);
router.put('/:id', protect, validate(updateReviewSchema), updateReview);
router.delete('/:id', protect, deleteReview);

export default router;
