import { Request, Response, NextFunction } from 'express';

// @desc    Upload one or more images
// @route   POST /api/upload
// @access  Admin
export const uploadImages = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!req.files || (Array.isArray(req.files) && req.files.length === 0)) {
            if (!req.file) {
                res.status(400).json({ success: false, message: 'No files uploaded' });
                return;
            }
        }

        const baseUrl = `${req.protocol}://${req.get('host')}`;

        // Handle array of files (field name "images") or single file (field name "image")
        const files = req.files
            ? Array.isArray(req.files)
                ? req.files
                : Object.values(req.files).flat()
            : req.file
                ? [req.file]
                : [];

        const urls = files.map((f) => `${baseUrl}/uploads/${f.filename}`);

        res.status(200).json({ success: true, urls });
    } catch (error) {
        next(error);
    }
};
