import { Router } from 'express';
import {
    getProducts,
    getProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
} from '../controllers/productController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validators/productValidators';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.post('/', protect, isAdmin, validate(createProductSchema), createProduct);
router.put('/:id', protect, isAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;
