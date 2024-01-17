const mongoose = require('mongoose')

const messageCollections = 'messages'

const messageSchema = new mongoose.Schema({
    user: {
        type: String,
        unique: true,
    },
    message: String,
    createdAt: Date,
    updatedAt: Date,
})

const Message = mongoose.model(messageCollections, messageSchema)

module.exports = Message