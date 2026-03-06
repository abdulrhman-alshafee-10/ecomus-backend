import { z } from 'zod';

const variantSchema = z.object({
    size: z.string().optional(),
    color: z.string().optional(),
    stock: z.number().min(0),
    sku: z.string().min(1, 'SKU is required'),
    price: z.number().min(0).optional(),
    images: z.array(z.string()).optional(),
});

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, 'Name is required'),
        slug: z.string().min(1, 'Slug is required'),
        description: z.string().optional(),
        price: z.number().min(0, 'Price must be positive'),
        salePrice: z.number().min(0).nullable().optional(),
        images: z.array(z.string()).optional(),
        category: z.string().min(1, 'Category is required'),
        brand: z.string().optional(),
        tags: z.array(z.string()).optional(),
        variants: z.array(variantSchema).optional(),
        stock: z.number().min(0).optional(),
        isFeatured: z.boolean().optional(),
    }),
});

export const updateProductSchema = z.object({
    body: z.object({
        name: z.string().min(1).optional(),
        slug: z.string().min(1).optional(),
        description: z.string().optional(),
        price: z.number().min(0).optional(),
        salePrice: z.number().min(0).nullable().optional(),
        images: z.array(z.string()).optional(),
        category: z.string().optional(),
        brand: z.string().optional(),
        tags: z.array(z.string()).optional(),
        variants: z.array(variantSchema).optional(),
        stock: z.number().min(0).optional(),
        isFeatured: z.boolean().optional(),
        isActive: z.boolean().optional(),
    }),
});
