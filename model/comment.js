const mongoose = require('mongoose')

const commentSchema = new mongoose.Schema({
    comment: String,
    author: String
})

module.exports = mongoose.model('Comment', commentSchema)