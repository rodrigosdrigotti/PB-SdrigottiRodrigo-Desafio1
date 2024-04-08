const CartDAO = require("../DAO/mongo/cart-dao.mongo");

const Cart = new CartDAO()

const getAll = async () => {
    try {
        const carts = await Cart.allCarts()
        
        return carts
    } catch (error) {
        throw error
    }
}

const getOneById = async cid => {
    try {
        const cartFound = await Cart.oneCartById(cid)

        return cartFound.products
    } catch (error) {
        throw error
    }
}

const insertOne = async newCartInfo => {
    try {
        newCartInfo.createdAt = new Date()
        newCartInfo.updatedAt = new Date()

        const newCart = await Cart.newCart(newCartInfo)

        return newCart
    } catch (error) {
        throw error
    }
} 

const insertInsideOne = async (cid, pid, quantity) => {
    try {
        const productAddedToCart = await Cart.newProductAddedToCart(cid, pid, quantity)

        return productAddedToCart
    } catch (error) {
        throw error
    }
}

const insertInsideOnePatch = async (cid, pid, quantity) => {
    try {
        const productAddedToCart = await Cart.newProductAddedToCartPatch(cid, pid, quantity)

        return productAddedToCart
    } catch (error) {
        throw error
    }
}

const updateOne = async (cid, pid, quantity) => {
    try {
        const productToUpdateQuantity = await Cart.updateProductQuantity(cid, pid, quantity)

        return productToUpdateQuantity
    } catch (error) {
        throw error
    }
}

const updateCart = async (cid, cartInfo) => {
    try {
        const cartUpdate = await Cart.updateCart(cid, cartInfo)
        
        return cartUpdate
    } catch (error) {
        throw error
    }
}

const deleteOne = async (cid, pid) => {
    try {
        const productDeleted = await Cart.deleteProductInCart(cid, pid)

        return productDeleted
    } catch (error) {
        throw error
    }
}

const deleteAll = async (cid) => {
    try {
        const productDeleted = await Cart.deleteAllProductsInCart(cid)

        return productDeleted
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getOneById,
    insertOne,
    insertInsideOne,
    insertInsideOnePatch,
    updateOne,
    updateCart,
    deleteOne,
    deleteAll,
}