import { Request, Response, NextFunction } from 'express';
import Review from '../models/Review';
import Product from '../models/Product';
import { AuthRequest } from '../middleware/auth';

// @desc    Get reviews for a product
// @route   GET /api/reviews?product=:id
// @access  Public
export const getReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filter = req.query.product ? { product: req.query.product } : {};
        const reviews = await Review.find(filter)
            .populate('user', 'name avatar')
            .sort('-createdAt');
        res.status(200).json({ success: true, count: reviews.length, data: reviews });
    } catch (error) {
        next(error);
    }
};

// @desc    Create review
// @route   POST /api/reviews
// @access  Private
export const createReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { product, rating, title, body, images } = req.body;

        const existing = await Review.findOne({ product, user: req.user?.id });
        if (existing) {
            res.status(400).json({ success: false, message: 'You have already reviewed this product' });
            return;
        }

        const review = await Review.create({ product, rating, title, body, images, user: req.user?.id });

        // Recalculate product rating
        const stats = await Review.aggregate([
            { $match: { product: review.product } },
            { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(product, {
                'rating.average': Math.round(stats[0].avgRating * 10) / 10,
                'rating.count': stats[0].count,
            });
        }

        res.status(201).json({ success: true, message: 'Review added', data: review });
    } catch (error) {
        next(error);
    }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }
        if (review.user.toString() !== req.user?.id) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        const updated = await Review.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        // Recalculate rating
        const stats = await Review.aggregate([
            { $match: { product: review.product } },
            { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        if (stats.length > 0) {
            await Product.findByIdAndUpdate(review.product, {
                'rating.average': Math.round(stats[0].avgRating * 10) / 10,
                'rating.count': stats[0].count,
            });
        }

        res.status(200).json({ success: true, message: 'Review updated', data: updated });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const review = await Review.findById(req.params.id);
        if (!review) {
            res.status(404).json({ success: false, message: 'Review not found' });
            return;
        }
        if (review.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        await review.deleteOne();

        // Recalculate rating
        const stats = await Review.aggregate([
            { $match: { product: review.product } },
            { $group: { _id: '$product', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } },
        ]);
        await Product.findByIdAndUpdate(review.product, {
            'rating.average': stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0,
            'rating.count': stats.length > 0 ? stats[0].count : 0,
        });

        res.status(200).json({ success: true, message: 'Review deleted' });
    } catch (error) {
        next(error);
    }
};
