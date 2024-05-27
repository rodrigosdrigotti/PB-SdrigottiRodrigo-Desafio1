const NewTicketDto = require("../DTO/new-ticket.dto");
const NewProductDto = require('../DTO/new-product.dto')
const productsService = require('../services/product.service')
const cartsService = require('../services/cart.service');
const Ticket = require("../DAO/models/ticket.model");

const purchase = async (cartId,cid,email) => {
    try {
        
        const productsNotPurchased = [];

        // Verificar el stock de los productos
        for (const prod of cartId) {
            const product = prod.product;
            const quantityInCart = prod.quantity;
            
            if (product.stock < quantityInCart) {
                productsNotPurchased.push(prod._id);
            }
        }
        
        //*CREAR TICKETS DE PRODUCTOS CON STOCK Y ACTUALIZAR STOCK DE PRODUCTOS
        if(productsNotPurchased.length > 0) {
            const productsPurchased = cartId.filter(item => !productsNotPurchased.includes(item._id))
            
            const totalAmount = productsPurchased.reduce((total, item) => {
                return total + (item.product.price * item.quantity)
            }, 0)

            // Actualizar el stock de los productos comprados
            for (const prod of productsPurchased) {
                const product = prod.product;
                const quantityInCart = prod.quantity;
                const updatedAt = new Date();

                product.stock -= quantityInCart;

                const productInfo = new NewProductDto(product, updatedAt);
                await productsService.updateOne(product._id, productInfo);
            }
            
            const cartToUpdate = cartId.filter(item => productsNotPurchased.includes(item._id))
            
            await cartsService.updateCart(cid, cartToUpdate)
            
            if(totalAmount === 0){
                return { newTicket: [], cartToUpdate }
            } else {
                const newTicketInfo = new NewTicketDto(totalAmount, email)
    
                const newTicket = await Ticket.create(newTicketInfo)
    
                return { newTicket, cartToUpdate }
            }
           
        } else {
            const totalAmount = cartId.reduce((total, item) => {
                return total + (item.product.price * item.quantity)
            }, 0)

            for (const prod of cartId) {
                const product = prod.product;
                const quantityInCart = prod.quantity;
                const updatedAt = new Date();

                product.stock -= quantityInCart;

                const productInfo = new NewProductDto(product, updatedAt);
                await productsService.updateOne(product._id, productInfo);
            }
            await cartsService.updateCart(cid, []);

            const newTicketInfo = new NewTicketDto(totalAmount, email);
            const newTicket = await Ticket.create(newTicketInfo);

            return { newTicket, cartToUpdate: [] };
        }

    } catch (error) {
        throw error
    }
} 

module.exports = {
    purchase,
}