const Cart = require('../models/cart.model')

class CartDAO {
    async allCarts() {
        return await Cart.find({}, {__v: 0})
    }

    async oneCartById(pid) {
        return await Cart.findById(pid)
    }

    async newCart(newCartInfo) {
        return await Cart.create(newCartInfo)
    }

    async newProductAddedToCart(cid, pid) {
        const cart = await Cart.findById(cid)    
        const existingProductIndex = cart.products.findIndex(prod => prod.product.equals(pid));
        
        if(existingProductIndex !== -1 ){
            cart.products[existingProductIndex].quantity += 1
            return await Cart.updateOne({_id: cid}, cart)
        } else {
            cart.products.push({
                product: pid,
                quantity: 1
            })
            return await Cart.updateOne({_id: cid}, cart)
        }
    }
}

module.exports = CartDAO