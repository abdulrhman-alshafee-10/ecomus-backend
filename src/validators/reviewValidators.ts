import { z } from 'zod';

export const createReviewSchema = z.object({
    body: z.object({
        product: z.string().min(1, 'Product is required'),
        rating: z.number().min(1).max(5),
        title: z.string().optional(),
        body: z.string().optional(),
        images: z.array(z.string()).optional(),
    }),
});

export const updateReviewSchema = z.object({
    body: z.object({
        rating: z.number().min(1).max(5).optional(),
        title: z.string().optional(),
        body: z.string().optional(),
        images: z.array(z.string()).optional(),
    }),
});
