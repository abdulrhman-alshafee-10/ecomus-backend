import { Router } from 'express';
import {
    getComments,
    createComment,
    updateComment,
    deleteComment,
} from '../controllers/commentController';
import { protect } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { createCommentSchema, updateCommentSchema } from '../validators/commentValidators';

const router = Router();

router.get('/', getComments);
router.post('/', protect, validate(createCommentSchema), createComment);
router.put('/:id', protect, validate(updateCommentSchema), updateComment);
router.delete('/:id', protect, deleteComment);

export default router;
