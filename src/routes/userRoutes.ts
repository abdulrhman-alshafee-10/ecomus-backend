import { Router } from 'express';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';
import { getUsers, getUserById, updateUser, deleteUser } from '../controllers/userController';

const router = Router();

router.use(protect, isAdmin);

router.get('/', getUsers);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
