import mongoose, { Document, Schema } from 'mongoose';

export interface IComment extends Document {
    blog: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    body: string;
    parent: mongoose.Types.ObjectId | null;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const commentSchema = new Schema<IComment>(
    {
        blog: { type: Schema.Types.ObjectId, ref: 'Blog', required: true },
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        body: { type: String, required: true, trim: true },
        parent: { type: Schema.Types.ObjectId, ref: 'Comment', default: null },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

export default mongoose.model<IComment>('Comment', commentSchema);
