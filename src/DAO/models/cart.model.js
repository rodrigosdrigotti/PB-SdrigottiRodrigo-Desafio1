const mongoose = require('mongoose')

const cartCollections = 'cart'

const cartSchema = new mongoose.Schema({
    products: {
        type:  [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'product'
                },
                quantity: {
                    type: Number,
                    required: true,
                    default: 1
                }
            }
        ],
    }, 
    status: {
        type: Boolean,
        default: true
    },
    createdAt: Date,
    updatedAt: Date,
})

cartSchema.pre('find', function(){
    this.populate('products.product')
})

cartSchema.pre('findOne', function(){
    this.populate('products.product')
})

const Cart = mongoose.model(cartCollections, cartSchema)

module.exports = Cart


