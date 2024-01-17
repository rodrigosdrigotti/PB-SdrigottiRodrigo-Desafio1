const CartManager = require("../DAO/fileSystem/CartManager");
const CartDAO = require("../DAO/mongo/cart-dao.mongo");

const Cart = new CartDAO()
//const Cart = new CartManager("./src/carrito.json")

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

const insertInsideOne = async (cid, pid)=> {
    try {
        const productAddedToCart = await Cart.newProductAddedToCart(cid, pid)

        return productAddedToCart
    } catch (error) {
        throw error
    }
}

module.exports = {
    getAll,
    getOneById,
    insertOne,
    insertInsideOne,
}