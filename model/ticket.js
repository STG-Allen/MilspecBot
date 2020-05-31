const mongoose = require('mongoose')

const ticketSchema = new mongoose.Schema({
        number: String,
        description: String,
        comment: Array,
        createdUtc: Date,
        status: String,
        solution: String
})

module.exports = mongoose.model('Ticket', ticketSchema)