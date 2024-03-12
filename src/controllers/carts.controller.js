const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const cartsService = require('../services/cart.service')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')
const User = require('../DAO/models/user.model')
const Ticket = require('../DAO/models/ticket.model')
const NewTicketDto = require('../DTO/new-ticket.dto')
const NewProductDto = require('../DTO/new-product.dto')
const productsService = require('../services/product.service')

const router = Router()

//! DEVUELVE TODOS LOS CARRITOS DE COMPRAS DEL USUARIO LOGUEADO
router.get('/', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const { email } = req.user
        
        const user = await User.findOne({email: email})
        
        if(!user.cart){
            res.render('cart', { style: 'index.css',})
        }
        else {
            const cartId = await cartsService.getOneById(user.cart)

            const userCartId = user.cart
            
            res.render('cart', { 
                userCartId,
                cartId,
                style: 'index.css',
            })
        }

    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! DEVUELVE UN CARRITO A TRAVES DEL CID PASADO POR PARAMS
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        
        const cartId = await cartsService.getOneById(cid)
        
        res.render('cart', { 
            cartId,
            style: 'index.css',
        })

        //res.json({ status: 'success', payload: cartId})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error: 'Carrito no Encontrado'  })
    }
})

//! CREA UN CARRITO CON UN ARRAY DE PRODUCTOS VACIO
router.post('/', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const { email } = req.user
        const user = await User.findOne({email: email})

        const pid = req.body.productId
        const quantity = req.body.quantity || 1
        
        if(!user.cart) {
            const newCartInfo = {
                products: [{
                    product: pid,
                    quantity
                }],
            }
            const newCart = await cartsService.insertOne(newCartInfo)
            user.cart = newCart._id
            
            const updateUser = await User.updateOne({email}, {cart: user.cart})
            
            res
            .status(HTTP_RESPONSES.CREATED)
            .json({ status: 'Success', payload: {newCart, updateUser}})
        }
        else {
            const productAdded = await cartsService.insertInsideOne(user.cart, pid)
            
            res
            .status(HTTP_RESPONSES.CREATED)
            .json({ status: 'Success', payload: productAdded})
        }
        
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! ELIMINAR DEL CARRITO EL PRODUCTO SELECCIONADO POR EL USUARIO
router.delete('/', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const { email } = req.user
        
        const user = await User.findOne({email: email})

        const { cart } = user
        const pid = req.body.productId

        const productDeleted = await cartsService.deleteOne(cart, pid)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productDeleted})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO 
router.delete('/:cid', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const { cid } = req.params

        const productsDeleted = await cartsService.deleteAll(cid)
        
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productsDeleted})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! FINALIZAR EL PROCESO DE COMPRA DEL CARRITO
router.post('/:cid/purchase', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const { cid } = req.params

        const cartId = await cartsService.getOneById(cid)

        if(!cartId) {
            return res
                .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
                .json({  status: 'error', error: 'Carrito no Encontrado'  })
        }
        
        const productsNotPurchased = [];

        cartId.map(prod => {
            const product = prod.product;
            const quantityInCart = prod.quantity;
            
            if(product.stock < quantityInCart){
                productsNotPurchased.push(prod._id);
            }
        })

        //*CREAR TICKETS DE PRODUCTOS CON STOCK Y ACTUALIZAR STOCK DE PRODUCTOS
        if(productsNotPurchased.length > 0) {
            const productsPurchased = cartId.filter(item => !productsNotPurchased.includes(item._id))

            const totalAmount = productsPurchased.reduce((total, item) => {
                return total + (item.product.price * item.quantity);
            }, 0);

            const newTicketInfo = new NewTicketDto(totalAmount, req.user.email)
    
            const newTicket = await Ticket.create(newTicketInfo)

            productsPurchased.map(async(prod) => {
                const product = prod.product;
                const quantityInCart = prod.quantity;
                const updatedAt = new Date()
                
                product.stock -= quantityInCart  

                const productInfo = new NewProductDto(product, updatedAt)

                await productsService.updateOne(product._id, productInfo)

            })

            cartId = cartId.filter(item => productsNotPurchased.includes(item._id))

            //await cartsService.updateCart(cid, cartToUpdate)
            
            
            return res
                .status(HTTP_RESPONSES.CREATED)
                .json({ status: 'Success', payload: newTicket})

            /* return res.render('purchase.handlebars', { 
                    newTicket,
                    style: 'index.css',
                }) */
        }
        
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})




//Agrega un producto por PID al carrito indicado por CID
router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params

        const productAdded = await cartsService.insertInsideOne(cid, pid)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productAdded})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})
//Agrega un producto por PID al carrito indicado por CID
router.put('/:cid', async (req, res) => {
    try {
        const cid = req.params.cid
        const pid = req.body.productId
        const quantity = req.body.quantity || 1

        const productAdded = await cartsService.insertInsideOnePatch(cid, pid, quantity)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productAdded})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})
//Actualizar SÓLO la variable quantity del producto indicado por la cantidad pasada por body
router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const productAdded = await cartsService.updateOne(cid, pid, quantity)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productAdded})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

module.exports = router