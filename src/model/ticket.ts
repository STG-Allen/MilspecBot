import mongoose from 'mongoose'

interface ITicketSchema {
  number: string,
  description: string,
  comment: string[],
  createdUtc: Date,
  status: string,
  solution: string,
}

const ticketSchema = new mongoose.Schema<ITicketSchema>({
  number: String,
  description: String,
  comment: Array,
  createdUtc: Date,
  status: String,
  solution: String
});

export default mongoose.model('Ticket', ticketSchema);