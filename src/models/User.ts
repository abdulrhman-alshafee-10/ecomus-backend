import mongoose, { Document, Schema } from 'mongoose';

export interface IAddress {
    fullName: string;
    phone: string;
    street: string;
    city: string;
    state?: string;
    country: string;
    zipCode?: string;
    isDefault: boolean;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    avatar: string;
    role: 'customer' | 'admin';
    addresses: IAddress[];
    wishlist: mongoose.Types.ObjectId[];
    recentlyViewed: mongoose.Types.ObjectId[];
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const addressSchema = new Schema<IAddress>({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, required: true },
    zipCode: { type: String },
    isDefault: { type: Boolean, default: false },
});

const userSchema = new Schema<IUser>(
    {
        name: { type: String, required: true, trim: true },
        email: { type: String, required: true, unique: true, lowercase: true, trim: true },
        password: { type: String, required: true },
        avatar: { type: String, default: '' },
        role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
        addresses: [addressSchema],
        wishlist: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        recentlyViewed: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IUser>('User', userSchema);
