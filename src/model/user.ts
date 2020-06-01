import mongoose from 'mongoose'

interface IUserSchema {
  userName: string,
  ticketNums: string[],
  discordId: string,
}

const userSchema = new mongoose.Schema<IUserSchema>({
    userName: String,
    ticketNums: [String],
    discordId: String
})

export default mongoose.model('User', userSchema);