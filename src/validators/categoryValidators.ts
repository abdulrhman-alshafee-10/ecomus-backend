import { z } from 'zod';

export const createCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().optional(),
        image: z.string().url('Invalid image URL').optional(),
        parent: z.string().optional(),
    }),
});

export const updateCategorySchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        image: z.string().url().optional(),
        parent: z.string().optional(),
        isActive: z.boolean().optional(),
    }),
});
