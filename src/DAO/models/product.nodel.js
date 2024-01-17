const mongoose = require('mongoose')

const productCollections = 'product'

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: String,
        unique: true,
    },
    price: Number,
    status: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    thumbnail: Buffer,
    createdAt: Date,
    updatedAt: Date,
})

const Product = mongoose.model(productCollections, productSchema)

module.exports = Product