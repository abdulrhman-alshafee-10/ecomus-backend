import { Router } from 'express';
import { upload } from '../middleware/upload';
import { uploadImages } from '../controllers/uploadController';
import { protect } from '../middleware/auth';
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

// Accept up to 10 images with field name "images", or a single "image" field
router.post(
    '/',
    protect,
    isAdmin,
    upload.fields([
        { name: 'images', maxCount: 10 },
        { name: 'image', maxCount: 1 },
    ]),
    uploadImages,
);

export default router;
