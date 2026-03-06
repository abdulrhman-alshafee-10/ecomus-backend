import { AuthRequest } from "./auth";
import { Response, NextFunction } from "express";

export const isAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user?.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden, admin access required' });
    }
    next();

}