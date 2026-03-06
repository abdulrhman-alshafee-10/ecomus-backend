import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import User from '../models/User';
import { ApiFeatures } from '../utils/apiFeatures';
import { IProduct } from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const features = new ApiFeatures<IProduct>(
            Product.find({ isActive: true }).populate('category', 'name slug'),
            req.query as any
        )
            .filter()
            .search(['name', 'brand', 'description'])
            .sort()
            .limitFields()
            .paginate();

        const total = await Product.countDocuments({ isActive: true });
        const products = await features.query;

        const page = parseInt(req.query.page as string || '1', 10);
        const limit = parseInt(req.query.limit as string || '12', 10);
        const pages = Math.ceil(total / limit);

        // Build page-number array (max 7 visible, with ellipsis boundaries)
        const buildPageNumbers = (current: number, total: number): (number | '...')[] => {
            if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
            const arr: (number | '...')[] = [1];
            if (current > 3) arr.push('...');
            for (let i = Math.max(2, current - 1); i <= Math.min(total - 1, current + 1); i++) arr.push(i);
            if (current < total - 2) arr.push('...');
            arr.push(total);
            return arr;
        };

        res.status(200).json({
            success: true,
            count: products.length,
            pagination: {
                total,
                page,
                pages,
                limit,
                hasPrev: page > 1,
                hasNext: page < pages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < pages ? page + 1 : null,
                pageNumbers: buildPageNumbers(page, pages),
            },
            data: products,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('category', 'name slug');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Get product by slug
// @route   GET /api/products/slug/:slug
// @access  Public
export const getProductBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .populate('category', 'name slug');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Create product
// @route   POST /api/products
// @access  Admin
export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await Product.create(req.body);
        res.status(201).json({ success: true, message: 'Product created', data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Admin
export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Product updated', data: product });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Admin
export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Product deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get featured products
// @route   GET /api/products/featured
// @access  Public
export const getFeaturedProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const products = await Product.find({ isFeatured: true, isActive: true })
            .populate('category', 'name slug')
            .limit(8);
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get new arrivals (latest products)
// @route   GET /api/products/new-arrivals?limit=8
// @access  Public
export const getNewArrivals = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const limit = Math.min(50, parseInt(req.query.limit as string || '8', 10));
        const products = await Product.find({ isActive: true })
            .populate('category', 'name slug')
            .sort({ createdAt: -1 })
            .limit(limit)
            .select('name slug price salePrice images brand rating category isFeatured createdAt');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get best sellers (most sold)
// @route   GET /api/products/best-sellers?limit=8
// @access  Public
export const getBestSellers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const limit = Math.min(50, parseInt(req.query.limit as string || '8', 10));
        const products = await Product.find({ isActive: true, sold: { $gt: 0 } })
            .populate('category', 'name slug')
            .sort({ sold: -1 })
            .limit(limit)
            .select('name slug price salePrice images brand rating category sold');
        res.status(200).json({ success: true, count: products.length, data: products });
    } catch (error) {
        next(error);
    }
};

// @desc    Get related products (same category + overlapping tags, excludes current)
// @route   GET /api/products/:id/related?limit=8
// @access  Public
export const getRelatedProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const product = await Product.findById(req.params.id).select('category tags');
        if (!product) {
            res.status(404).json({ success: false, message: 'Product not found' });
            return;
        }

        const limit = Math.min(20, parseInt(req.query.limit as string || '8', 10));

        const related = await Product.find({
            _id: { $ne: product._id },
            isActive: true,
            $or: [
                { category: product.category },
                { tags: { $in: product.tags } },
            ],
        })
            .populate('category', 'name slug')
            .sort({ 'rating.average': -1 })
            .limit(limit)
            .select('name slug price salePrice images brand rating category');

        res.status(200).json({ success: true, count: related.length, data: related });
    } catch (error) {
        next(error);
    }
};

// @desc    Toggle product in user wishlist (add / remove)
// @route   PUT /api/products/:id/wishlist
// @access  Private
export const toggleWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const productId = req.params.id;
        const index = user.wishlist.findIndex((id) => id.toString() === productId);

        let action: string;
        if (index === -1) {
            user.wishlist.push(productId as any);
            action = 'added';
        } else {
            user.wishlist.splice(index, 1);
            action = 'removed';
        }

        await user.save();
        res.status(200).json({ success: true, message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`, wishlist: user.wishlist });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user's wishlist
// @route   GET /api/products/wishlist
// @access  Private
export const getWishlist = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id)
            .populate({
                path: 'wishlist',
                select: 'name slug price salePrice images brand rating category isActive',
                populate: { path: 'category', select: 'name slug' },
            });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, count: user.wishlist.length, data: user.wishlist });
    } catch (error) {
        next(error);
    }
};

// @desc    Track a product as recently viewed (stores up to 20)
// @route   POST /api/products/:id/viewed
// @access  Private
export const trackViewed = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const user = await User.findById(req.user?.id);
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }

        const productId = req.params.id;

        // Remove duplicate if already in list, then prepend
        user.recentlyViewed = user.recentlyViewed.filter((id) => id.toString() !== productId);
        user.recentlyViewed.unshift(productId as any);

        // Keep only the 20 most recent
        if (user.recentlyViewed.length > 20) {
            user.recentlyViewed = user.recentlyViewed.slice(0, 20);
        }

        await user.save();
        res.status(200).json({ success: true, message: 'Tracked' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user's recently viewed products
// @route   GET /api/products/recently-viewed
// @access  Private
export const getRecentlyViewed = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const limit = Math.min(20, parseInt(req.query.limit as string || '10', 10));
        const user = await User.findById(req.user?.id)
            .populate({
                path: 'recentlyViewed',
                select: 'name slug price salePrice images brand rating category isActive',
                populate: { path: 'category', select: 'name slug' },
                options: { limit },
            });
        if (!user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.status(200).json({ success: true, count: user.recentlyViewed.length, data: user.recentlyViewed });
    } catch (error) {
        next(error);
    }
};
