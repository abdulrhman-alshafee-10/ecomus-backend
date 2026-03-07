import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import User from '../models/User';

// GET /api/users  — paginated list with optional search
export const getUsers = async (req: AuthRequest, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = (req.query.search as string) || '';
        const role = (req.query.role as string) || '';

        const query: Record<string, unknown> = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
            ];
        }
        if (role) query.role = role;

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .select('-password -wishlist -recentlyViewed -addresses')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        res.json({ users, total, page, pages: Math.ceil(total / limit) });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: (error as Error).message });
    }
};

// GET /api/users/:id
export const getUserById = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user', error: (error as Error).message });
    }
};

// PUT /api/users/:id  — update role or isActive
export const updateUser = async (req: AuthRequest, res: Response) => {
    try {
        const { role, isActive, name } = req.body;
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Prevent demoting yourself
        if (req.user?.id === user.id.toString() && role && role !== user.role) {
            return res.status(400).json({ message: 'You cannot change your own role' });
        }

        if (role !== undefined) user.role = role;
        if (isActive !== undefined) user.isActive = isActive;
        if (name !== undefined) user.name = name;

        await user.save();
        const updated = await User.findById(user._id).select('-password -wishlist -recentlyViewed -addresses');
        res.json(updated);
    } catch (error) {
        res.status(500).json({ message: 'Failed to update user', error: (error as Error).message });
    }
};

// DELETE /api/users/:id
export const deleteUser = async (req: AuthRequest, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (req.user?.id === user.id.toString()) {
            return res.status(400).json({ message: 'You cannot delete your own account' });
        }

        await user.deleteOne();
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: (error as Error).message });
    }
};
