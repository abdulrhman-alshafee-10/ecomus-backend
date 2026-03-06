import { z } from 'zod';

const orderItemSchema = z.object({
    product: z.string().min(1, 'Product is required'),
    name: z.string().min(1),
    image: z.string().optional(),
    price: z.number().min(0),
    quantity: z.number().min(1),
    variant: z.object({
        size: z.string().optional(),
        color: z.string().optional(),
        sku: z.string().optional(),
    }).optional(),
});

const shippingAddressSchema = z.object({
    fullName: z.string().min(1),
    phone: z.string().min(1),
    street: z.string().min(1),
    city: z.string().min(1),
    state: z.string().optional(),
    country: z.string().min(1),
    zipCode: z.string().optional(),
});

export const createOrderSchema = z.object({
    body: z.object({
        items: z.array(orderItemSchema).min(1, 'At least one item is required'),
        shippingAddress: shippingAddressSchema,
        paymentMethod: z.enum(['card', 'cash_on_delivery', 'paypal']),
        subtotal: z.number().min(0),
        shippingCost: z.number().min(0).optional(),
        discount: z.number().min(0).optional(),
        total: z.number().min(0),
        couponCode: z.string().optional(),
        notes: z.string().optional(),
    }),
});

export const updateOrderStatusSchema = z.object({
    body: z.object({
        orderStatus: z.enum(['pending', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
        paymentStatus: z.enum(['pending', 'paid', 'failed', 'refunded']).optional(),
    }),
});
