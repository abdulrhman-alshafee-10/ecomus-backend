import { Router } from 'express';
import {
    getBlogs,
    getBlog,
    createBlog,
    updateBlog,
    deleteBlog,
} from '../controllers/blogController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { validate } from '../middleware/validate';
import { createBlogSchema, updateBlogSchema } from '../validators/blogValidators';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlog);
router.post('/', protect, isAdmin, validate(createBlogSchema), createBlog);
router.put('/:id', protect, isAdmin, validate(updateBlogSchema), updateBlog);
router.delete('/:id', protect, isAdmin, deleteBlog);

export default router;
