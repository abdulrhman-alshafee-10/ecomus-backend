import { Router } from 'express';
import {
    getProducts,
    getProduct,
    getProductBySlug,
    createProduct,
    updateProduct,
    deleteProduct,
    getFeaturedProducts,
    getNewArrivals,
    getBestSellers,
    getRelatedProducts,
    toggleWishlist,
    getWishlist,
    trackViewed,
    getRecentlyViewed,
} from '../controllers/productController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { validate } from '../middleware/validate';
import { createProductSchema, updateProductSchema } from '../validators/productValidators';

const router = Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/new-arrivals', getNewArrivals);
router.get('/best-sellers', getBestSellers);
router.get('/wishlist', protect, getWishlist);
router.get('/recently-viewed', protect, getRecentlyViewed);
router.get('/slug/:slug', getProductBySlug);
router.get('/:id', getProduct);
router.get('/:id/related', getRelatedProducts);
router.put('/:id/wishlist', protect, toggleWishlist);
router.post('/:id/viewed', protect, trackViewed);
router.post('/', protect, isAdmin, validate(createProductSchema), createProduct);
router.put('/:id', protect, isAdmin, validate(updateProductSchema), updateProduct);
router.delete('/:id', protect, isAdmin, deleteProduct);

export default router;
