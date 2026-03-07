import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import Blog from '../models/Blog';

export const getStats = async (req: AuthRequest, res: Response) => {
    try {
        const [totalProducts, totalOrders, totalUsers, totalBlogs] = await Promise.all([
            Product.countDocuments({ isActive: true }),
            Order.countDocuments(),
            User.countDocuments({ isActive: true }),
            Blog.countDocuments({ isPublished: true }),
        ]);

        // Total revenue from delivered/paid orders
        const revenueResult = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            { $group: { _id: null, total: { $sum: '$total' } } },
        ]);
        const totalRevenue = revenueResult[0]?.total ?? 0;

        // Revenue per day — last 30 days
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const revenueByDay = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    createdAt: { $gte: thirtyDaysAgo },
                },
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$total' },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { _id: 1 } },
        ]);

        // Orders grouped by status
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$orderStatus', count: { $sum: 1 } } },
        ]);

        // Recent 5 orders
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('user', 'name email')
            .select('user total orderStatus paymentStatus createdAt');

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalBlogs,
            totalRevenue,
            revenueByDay,
            ordersByStatus,
            recentOrders,
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error: (error as Error).message });
    }
};
