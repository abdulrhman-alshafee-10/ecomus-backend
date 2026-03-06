import { Request, Response, NextFunction } from 'express';
import Product from '../models/Product';
import Category from '../models/Category';
import Blog from '../models/Blog';

// @desc    Global search across products, categories and blogs
// @route   GET /api/search?q=term&type=products|categories|blogs&page=1&limit=12
// @access  Public
export const search = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const q = (req.query.q as string || '').trim();
        const type = (req.query.type as string || 'all').toLowerCase();
        const page = Math.max(1, parseInt(req.query.page as string || '1', 10));
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string || '12', 10)));
        const skip = (page - 1) * limit;

        if (!q) {
            res.status(400).json({ success: false, message: 'Search query "q" is required' });
            return;
        }

        const regex = new RegExp(q, 'i');
        const results: Record<string, any> = {};

        const runProducts = type === 'all' || type === 'products';
        const runCategories = type === 'all' || type === 'categories';
        const runBlogs = type === 'all' || type === 'blogs';

        const [products, categories, blogs] = await Promise.all([
            runProducts
                ? Product.find({
                    isActive: true,
                    $or: [
                        { name: regex },
                        { brand: regex },
                        { description: regex },
                        { tags: regex },
                    ],
                })
                    .populate('category', 'name slug')
                    .select('name slug price salePrice images brand rating category isFeatured')
                    .skip(skip)
                    .limit(limit)
                : Promise.resolve(null),

            runCategories
                ? Category.find({ isActive: true, $or: [{ name: regex }, { description: regex }] })
                    .select('name slug description image')
                    .limit(10)
                : Promise.resolve(null),

            runBlogs
                ? Blog.find({ isPublished: true, $or: [{ title: regex }, { excerpt: regex }, { tags: regex }] })
                    .select('title slug excerpt coverImage publishedAt')
                    .limit(10)
                : Promise.resolve(null),
        ]);

        if (runProducts && products !== null) {
            const total = await Product.countDocuments({
                isActive: true,
                $or: [{ name: regex }, { brand: regex }, { description: regex }, { tags: regex }],
            });
            results.products = {
                data: products,
                total,
                page,
                pages: Math.ceil(total / limit),
            };
        }

        if (runCategories && categories !== null) {
            results.categories = { data: categories, total: categories.length };
        }

        if (runBlogs && blogs !== null) {
            results.blogs = { data: blogs, total: blogs.length };
        }

        res.status(200).json({ success: true, query: q, results });
    } catch (error) {
        next(error);
    }
};
