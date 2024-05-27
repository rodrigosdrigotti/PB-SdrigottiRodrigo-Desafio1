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
        enum: ['user', 'admin', 'premium'],
        default: 'user'
    },
    cart: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'cart',
        default: null    
    }, 
    githubId: Number,
    githubUsername: String,
    status: {
        type: Boolean,
        default: true
    },
    createdAt: Date,
    updatedAt: Date,
})

userSchema.pre('find', function(){
    this.populate('cart')
})


const User = mongoose.model(userCollections, userSchema)

module.exports = User