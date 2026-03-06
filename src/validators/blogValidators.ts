import { z } from 'zod';

export const createBlogSchema = z.object({
    body: z.object({
        title: z.string().min(1, 'Title is required'),
        slug: z.string().min(1, 'Slug is required'),
        content: z.string().min(1, 'Content is required'),
        excerpt: z.string().optional(),
        coverImage: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
        isPublished: z.boolean().optional(),
    }),
});

export const updateBlogSchema = z.object({
    body: z.object({
        title: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        content: z.string().min(1).optional(),
        excerpt: z.string().optional(),
        coverImage: z.string().url().optional(),
        tags: z.array(z.string()).optional(),
        isPublished: z.boolean().optional(),
    }),
});
