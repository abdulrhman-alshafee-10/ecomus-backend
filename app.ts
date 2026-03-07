import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './src/config/swagger';
import connectDB from './src/config/db';
import { errorHandler, notFound } from './src/middleware/errorHandler';
import { globalLimiter } from './src/middleware/rateLimiter';
import authRoutes from './src/routes/authRoutes';
import searchRoutes from './src/routes/searchRoutes';
import categoryRoutes from './src/routes/categoryRoutes';
import productRoutes from './src/routes/productRoutes';
import orderRoutes from './src/routes/orderRoutes';
import reviewRoutes from './src/routes/reviewRoutes';
import blogRoutes from './src/routes/blogRoutes';
import commentRoutes from './src/routes/commentRoutes';
import userRoutes from './src/routes/userRoutes';
import statsRoutes from './src/routes/statsRoutes';
import uploadRoutes from './src/routes/uploadRoutes';

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(globalLimiter);

// Serve uploaded images as static files
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Swagger docs — disable helmet CSP for this route so the UI loads correctly
app.use('/api/docs', (_req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Content-Security-Policy', '');
    next();
}, swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Ecomus API Docs',
    swaggerOptions: { persistAuthorization: true },
}));

// Expose raw OpenAPI JSON
app.get('/api/docs.json', (_req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
});

// Health check
app.get('/', (_req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Ecomus API is running 🚀' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/upload', uploadRoutes);

// 404 + Error Handler (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

export default app;

