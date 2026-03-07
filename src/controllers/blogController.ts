import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import Blog from '../models/Blog';
import { AuthRequest } from '../middleware/auth';
import { ApiFeatures } from '../utils/apiFeatures';
import { IBlog } from '../models/Blog';

// @desc    Get all blogs
// @route   GET /api/blogs
// @access  Public
export const getBlogs = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const showAll = req.query.all === 'true';
        const baseFilter = showAll ? {} : { isPublished: true };

        const features = new ApiFeatures<IBlog>(
            Blog.find(baseFilter).populate('author', 'name avatar'),
            req.query as any
        )
            .search(['title', 'excerpt'])
            .sort()
            .limitFields()
            .paginate();

        const total = await Blog.countDocuments(baseFilter);
        const blogs = await features.query;

        res.status(200).json({
            success: true,
            count: blogs.length,
            total,
            page: parseInt(req.query.page as string || '1', 10),
            pages: Math.ceil(total / parseInt(req.query.limit as string || '12', 10)),
            data: blogs,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single blog by slug
// @route   GET /api/blogs/:slug
// @access  Public
export const getBlog = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { slug } = req.params;
        const query = mongoose.isValidObjectId(slug) ? { _id: slug } : { slug };
        const blog = await Blog.findOne(query).populate('author', 'name avatar');
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        // Increment views
        blog.views += 1;
        await blog.save({ validateBeforeSave: false });

        res.status(200).json({ success: true, data: blog });
    } catch (error) {
        next(error);
    }
};

// @desc    Create blog
// @route   POST /api/blogs
// @access  Admin
export const createBlog = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const blog = await Blog.create({
            ...req.body,
            author: req.user?.id,
            publishedAt: req.body.isPublished ? new Date() : undefined,
        });
        res.status(201).json({ success: true, message: 'Blog created', data: blog });
    } catch (error) {
        next(error);
    }
};

// @desc    Update blog
// @route   PUT /api/blogs/:id
// @access  Admin
export const updateBlog = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const update = { ...req.body };
        if (req.body.isPublished) update.publishedAt = new Date();

        const blog = await Blog.findByIdAndUpdate(req.params.id, update, { new: true, runValidators: true });
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Blog updated', data: blog });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete blog
// @route   DELETE /api/blogs/:id
// @access  Admin
export const deleteBlog = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            res.status(404).json({ success: false, message: 'Blog not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Blog deleted' });
    } catch (error) {
        next(error);
    }
};
