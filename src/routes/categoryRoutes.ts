import { Router } from 'express';
import {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
} from '../controllers/categoryController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { validate } from '../middleware/validate';
import { createCategorySchema, updateCategorySchema } from '../validators/categoryValidators';

const router = Router();

router.get('/', getCategories);
router.get('/:id', getCategory);
router.post('/', protect, isAdmin, validate(createCategorySchema), createCategory);
router.put('/:id', protect, isAdmin, validate(updateCategorySchema), updateCategory);
router.delete('/:id', protect, isAdmin, deleteCategory);

export default router;
