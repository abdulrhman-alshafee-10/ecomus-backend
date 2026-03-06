import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './src/config/db';
import { errorHandler, notFound } from './src/middleware/errorHandler';
import { globalLimiter } from './src/middleware/rateLimiter';

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

// Health check
app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'Ecomus API is running 🚀' });
});

// 404 + Error Handler (must be last)
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});

export default app;

