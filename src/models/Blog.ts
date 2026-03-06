import mongoose, { Document, Schema } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    coverImage: string;
    author: mongoose.Types.ObjectId;
    tags: string[];
    isPublished: boolean;
    publishedAt?: Date;
    views: number;
    createdAt: Date;
    updatedAt: Date;
}

const blogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true, trim: true },
        slug: { type: String, required: true, unique: true, lowercase: true },
        content: { type: String, required: true },
        excerpt: { type: String, default: '' },
        coverImage: { type: String, default: '' },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        tags: [{ type: String }],
        isPublished: { type: Boolean, default: false },
        publishedAt: { type: Date },
        views: { type: Number, default: 0 },
    },
    { timestamps: true }
);

export default mongoose.model<IBlog>('Blog', blogSchema);
