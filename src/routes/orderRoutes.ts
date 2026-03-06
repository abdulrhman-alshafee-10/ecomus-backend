import { Router } from 'express';
import {
    createOrder,
    getMyOrders,
    getOrder,
    cancelOrder,
    getAllOrders,
    updateOrderStatus,
} from '../controllers/orderController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { validate } from '../middleware/validate';
import { createOrderSchema, updateOrderStatusSchema } from '../validators/orderValidators';

const router = Router();

// Private
router.post('/', protect, validate(createOrderSchema), createOrder);
router.get('/my', protect, getMyOrders);
router.get('/:id', protect, getOrder);
router.put('/:id/cancel', protect, cancelOrder);

// Admin
router.get('/', protect, isAdmin, getAllOrders);
router.put('/:id/status', protect, isAdmin, validate(updateOrderStatusSchema), updateOrderStatus);

export default router;
