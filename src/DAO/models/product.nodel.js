const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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
    available: {
        type: Boolean,
        default: true
    },
    stock: Number,
    category: String,
    thumbnail: String,
    createdAt: Date,
    updatedAt: Date,
})

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model(productCollections, productSchema)

module.exports = Product