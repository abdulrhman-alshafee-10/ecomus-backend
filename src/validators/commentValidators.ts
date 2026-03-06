import { z } from 'zod';

export const createCommentSchema = z.object({
    body: z.object({
        blog: z.string().min(1, 'Blog is required'),
        body: z.string().min(1, 'Comment body is required'),
        parent: z.string().optional(),
    }),
});

export const updateCommentSchema = z.object({
    body: z.object({
        body: z.string().min(1, 'Comment body is required'),
    }),
});
