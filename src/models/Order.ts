import mongoose, { Document, Schema } from 'mongoose';

export interface IOrderItem {
    product: mongoose.Types.ObjectId;
    name: string;
    image?: string;
    price: number;
    quantity: number;
    variant?: {
        size?: string;
        color?: string;
        sku?: string;
    };
}

export interface IOrder extends Document {
    user: mongoose.Types.ObjectId;
    items: IOrderItem[];
    shippingAddress: {
        fullName: string;
        phone: string;
        street: string;
        city: string;
        state?: string;
        country: string;
        zipCode?: string;
    };
    paymentMethod: 'card' | 'cash_on_delivery' | 'paypal';
    paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
    orderStatus: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
    subtotal: number;
    shippingCost: number;
    discount: number;
    total: number;
    couponCode: string;
    notes: string;
    deliveredAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>({
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    variant: {
        size: { type: String },
        color: { type: String },
        sku: { type: String },
    },
});

const orderSchema = new Schema<IOrder>(
    {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        items: [orderItemSchema],
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            street: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String },
            country: { type: String, required: true },
            zipCode: { type: String },
        },
        paymentMethod: { type: String, enum: ['card', 'cash_on_delivery', 'paypal'], required: true },
        paymentStatus: { type: String, enum: ['pending', 'paid', 'failed', 'refunded'], default: 'pending' },
        orderStatus: { type: String, enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
        subtotal: { type: Number, required: true },
        shippingCost: { type: Number, default: 0 },
        discount: { type: Number, default: 0 },
        total: { type: Number, required: true },
        couponCode: { type: String, default: '' },
        notes: { type: String, default: '' },
        deliveredAt: { type: Date },
    },
    { timestamps: true }
);

export default mongoose.model<IOrder>('Order', orderSchema);
