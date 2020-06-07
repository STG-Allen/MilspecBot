import mongoose from 'mongoose'
import type { Document } from 'mongoose';

interface IUser extends Document {
  userName: string,
  ticketNums: string[],
  discordId: string,
}

const userSchema = new mongoose.Schema({
    userName: String,
    ticketNums: [String],
    discordId: String
})

export default mongoose.model<IUser>('User', userSchema);