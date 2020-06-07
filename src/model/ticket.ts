import mongoose from 'mongoose'
import type { Document } from 'mongoose';


interface Iticket extends Document {
  number: string,
  description: string,
  comment: Array<{
    comment: string,
    author: string,
  }>,
  createdUtc: Date,
  status: string,
  solution: string,
}

const ticketSchema = new mongoose.Schema({
  number: String,
  description: String,
  comment: Array,
  createdUtc: Date,
  status: String,
  solution: String
});

export default mongoose.model<Iticket>('Ticket', ticketSchema);