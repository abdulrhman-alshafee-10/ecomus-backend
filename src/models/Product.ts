import mongoose, { Document, Schema } from 'mongoose';

export interface IVariant {
    size?: string;
    color?: string;
    stock: number;
    sku: string;
    price?: number;
    images: string[];
}

export interface IProduct extends Document {
    name: string;
    slug: string;
    description: string;
    price: number;
    salePrice: number | null;
    images: string[];
    category: mongoose.Types.ObjectId;
    brand: string;
    tags: string[];
    variants: IVariant[];
    stock: number;
    sold: number;
    rating: {
        average: number;
        count: number;
    };
    isFeatured: boolean;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const variantSchema = new Schema<IVariant>({
    size: { type: String },
    color: { type: String },
    stock: { type: Number, required: true, min: 0, default: 0 },
    sku: { type: String, required: true, unique: true },
    price: { type: Number },
    images: [{ type: String }],
});

const productSchema = new Schema<IProduct>(
    {
        name: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        description: { type: String, default: '' },
        price: { type: Number, required: true, min: 0 },
        salePrice: { type: Number, default: null },
        images: [{ type: String }],
        category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
        brand: { type: String, default: '' },
        tags: [{ type: String }],
        variants: [variantSchema],
        stock: { type: Number, default: 0, min: 0 },
        sold: { type: Number, default: 0 },
        rating: {
            average: { type: Number, default: 0, min: 0, max: 5 },
            count: { type: Number, default: 0 },
        },
        isFeatured: { type: Boolean, default: false },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IProduct>('Product', productSchema);
