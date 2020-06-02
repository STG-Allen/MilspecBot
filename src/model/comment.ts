import mongoose from 'mongoose'
import type { Document } from 'mongoose';

interface IComment extends Document {
  comment: string,
  author: string,
}

const commentSchema = new mongoose.Schema({
    comment: String,
    author: String
});

export default mongoose.model<IComment>('Comment', commentSchema);