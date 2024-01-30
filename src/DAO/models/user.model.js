const mongoose = require('mongoose')

const userCollections = 'user'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    }   
})

const User = mongoose.model(userCollections, userSchema)

module.exports = User