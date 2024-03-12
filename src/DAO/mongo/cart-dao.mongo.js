const Cart = require('../models/cart.model')

class CartDAO {
    async allCarts() {
        return await Cart.find({}, {__v: 0})
    }

    async oneCartById(cid) {
        return await Cart.findOne({_id: cid}, {__v: 0})
    }

    async newCart(newCartInfo) {
        return await Cart.create(newCartInfo)
    }

    async newProductAddedToCart(cid, pid) {
        const cart = await Cart.findById(cid)    
        const existingProductIndex = cart.products.findIndex(prod => prod.product.equals(pid))
        
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

    async newProductAddedToCartPatch(cid, pid, quantity) {
        const cart = await Cart.findById(cid)    
        const existingProductIndex = cart.products.findIndex(prod => prod.product.equals(pid))
        
        if(existingProductIndex !== -1 ){
            cart.products[existingProductIndex].quantity += quantity
            return await Cart.updateOne({_id: cid}, cart)
        } else {
            cart.products.push({
                product: pid,
                quantity: quantity
            })
            return await Cart.updateOne({_id: cid}, cart)
        }
    }

    async updateProductQuantity(cid, pid, quantity) {
        const cart = await Cart.findById(cid)    
        const productInCart = cart.products.find(prod => prod.product.equals(pid))
        
        //VER COMO MANEJAR EL ERROR
        if (!productInCart) {
            return res.json({ status: 'error'});
        }      
        
        productInCart.quantity = quantity;

        return await Cart.updateOne({_id: cid}, cart)
    }

    async updateCart(cid, cartInfo) {

        return await Cart.updateOne({_id: cid}, cartInfo)
    }

    async deleteProductInCart(cid, pid) {
        const cart = await Cart.findById(cid)  
        cart.products = cart.products.filter(prod => !prod.product.equals(pid))

        return await Cart.updateOne({_id: cid}, cart)
    }

    async deleteAllProductsInCart(cid) {
        const cart = await Cart.findById(cid)  
        cart.products = [];

        return await Cart.updateOne({_id: cid}, cart)
    }
}

module.exports = CartDAO