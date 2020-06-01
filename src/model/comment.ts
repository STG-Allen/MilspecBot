import mongoose from 'mongoose'

interface ICommentSchema {
  comment: string,
  author: string,
}

const commentSchema = new mongoose.Schema<ICommentSchema>({
    comment: String,
    author: String
});

export default mongoose.model('Comment', commentSchema);