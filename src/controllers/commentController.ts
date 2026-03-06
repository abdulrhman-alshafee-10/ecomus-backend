import { Request, Response, NextFunction } from 'express';
import Comment from '../models/Comment';
import { AuthRequest } from '../middleware/auth';

// @desc    Get comments for a blog
// @route   GET /api/comments?blog=:id
// @access  Public
export const getComments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const filter: Record<string, any> = { isActive: true, parent: null };
        if (req.query.blog) filter.blog = req.query.blog;

        const comments = await Comment.find(filter)
            .populate('user', 'name avatar')
            .populate({
                path: 'parent',
                populate: { path: 'user', select: 'name avatar' },
            })
            .sort('createdAt');

        res.status(200).json({ success: true, count: comments.length, data: comments });
    } catch (error) {
        next(error);
    }
};

// @desc    Create comment
// @route   POST /api/comments
// @access  Private
export const createComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await Comment.create({ ...req.body, user: req.user?.id });
        await comment.populate('user', 'name avatar');
        res.status(201).json({ success: true, message: 'Comment added', data: comment });
    } catch (error) {
        next(error);
    }
};

// @desc    Update comment
// @route   PUT /api/comments/:id
// @access  Private
export const updateComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }
        if (comment.user.toString() !== req.user?.id) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }
        comment.body = req.body.body;
        await comment.save();
        res.status(200).json({ success: true, message: 'Comment updated', data: comment });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete comment
// @route   DELETE /api/comments/:id
// @access  Private
export const deleteComment = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            res.status(404).json({ success: false, message: 'Comment not found' });
            return;
        }
        if (comment.user.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }
        // Soft delete
        comment.isActive = false;
        await comment.save();
        res.status(200).json({ success: true, message: 'Comment deleted' });
    } catch (error) {
        next(error);
    }
};
