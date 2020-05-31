const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: String,
    ticketNums: [String],
    discordId: String
}
)

module.exports = mongoose.model('User', userSchema)