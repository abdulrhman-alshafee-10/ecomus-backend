import { Response, NextFunction } from 'express';
import Order from '../models/Order';
import { AuthRequest } from '../middleware/auth';

// @desc    Create order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const order = await Order.create({ ...req.body, user: req.user?.id });
        res.status(201).json({ success: true, message: 'Order placed', data: order });
    } catch (error) {
        next(error);
    }
};

// @desc    Get my orders
// @route   GET /api/orders/my
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const orders = await Order.find({ user: req.user?.id }).sort('-createdAt');
        res.status(200).json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Private
export const getOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }

        // Only owner or admin can view
        if (order.user._id.toString() !== req.user?.id && req.user?.role !== 'admin') {
            res.status(403).json({ success: false, message: 'Not authorized to view this order' });
            return;
        }

        res.status(200).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
export const cancelOrder = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }

        if (order.user.toString() !== req.user?.id) {
            res.status(403).json({ success: false, message: 'Not authorized' });
            return;
        }

        if (['shipped', 'delivered'].includes(order.orderStatus)) {
            res.status(400).json({ success: false, message: 'Cannot cancel an order that has been shipped or delivered' });
            return;
        }

        order.orderStatus = 'cancelled';
        await order.save();

        res.status(200).json({ success: true, message: 'Order cancelled', data: order });
    } catch (error) {
        next(error);
    }
};

// ── Admin ──────────────────────────────────────────────────────────────────────

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Admin
export const getAllOrders = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const page = parseInt(req.query.page as string || '1', 10);
        const limit = parseInt(req.query.limit as string || '20', 10);
        const skip = (page - 1) * limit;

        const total = await Order.countDocuments();
        const orders = await Order.find()
            .populate('user', 'name email')
            .sort('-createdAt')
            .skip(skip)
            .limit(limit);

        res.status(200).json({ success: true, count: orders.length, total, page, data: orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (admin)
// @route   PUT /api/orders/:id/status
// @access  Admin
export const updateOrderStatus = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { orderStatus, paymentStatus } = req.body;
        const update: Record<string, any> = {};
        if (orderStatus) update.orderStatus = orderStatus;
        if (paymentStatus) update.paymentStatus = paymentStatus;
        if (orderStatus === 'delivered') update.deliveredAt = new Date();

        const order = await Order.findByIdAndUpdate(req.params.id, update, { new: true });
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        res.status(200).json({ success: true, message: 'Order status updated', data: order });
    } catch (error) {
        next(error);
    }
};
