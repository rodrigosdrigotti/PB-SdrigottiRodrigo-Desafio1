const Product = require("../models/product.nodel");

class ProductDAO {

    async insertManyProducts(allProductsToAdd) {
        return await Product.insertMany(allProductsToAdd)
    }
    
    async daleteAllProducts() {
        return await Product.deleteMany({})
    }

    async allProducts() {
        return await Product.find({status: true})
    }

    async oneProductById(pid) {
        return await Product.findById(pid)
    }

    async newProduct(newProductInfo) {
        return await Product.create(newProductInfo)
    }

    async updateProduct(pid, productInfo) {
        return await Product.updateOne({_id: pid}, productInfo)
    }

    async deleteProduct(pid, newStatus) {
        return await Product.updateOne({_id: pid}, newStatus)
    }
}

module.exports = ProductDAO