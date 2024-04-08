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
    owner: {
        type: mongoose.Schema.Types.String,
        ref: 'user',
        default: 'admin',
    }
})

/* productSchema.pre('find', function(){
    this.populate('owner')
})

productSchema.pre('findOne', function(){
    this.populate('owner')
}) */

productSchema.plugin(mongoosePaginate)

const Product = mongoose.model(productCollections, productSchema)

module.exports = Product