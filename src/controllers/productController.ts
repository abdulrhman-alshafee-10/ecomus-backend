import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import { ApiFeatures } from '../utils/apiFeatures';
import { IProduct } from '../models/Product';

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

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            page: parseInt(req.query.page as string || '1', 10),
            pages: Math.ceil(total / parseInt(req.query.limit as string || '12', 10)),
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
