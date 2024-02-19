const mongoose = require('mongoose')

const userCollections = 'user'

const userSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    email: {
        type: String,
        unique: true,
    },
    age: Number,
    password: String,
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        default: null    
    }, 
    githubId: Number,
    githubUsername: String,
})

userSchema.pre('find', function(){
    this.populate('cart')
})

const User = mongoose.model(userCollections, userSchema)

module.exports = User