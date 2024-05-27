const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const cartsService = require('../services/cart.service')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')
const User = require('../DAO/models/user.model')
const ticketService = require('../services/ticket.service')
const productsService = require('../services/product.service')

const router = Router()

//! DEVUELVE TODOS LOS CARRITOS DE COMPRAS DEL USUARIO LOGUEADO
router.get('/', passportCall('jwt'), authorization(['premium', 'user', 'admin']), async (req, res) => {
    try {
        const { email } = req.user
        
        const user = await User.findOne({email: email})
        
        if(!user.cart){
            res.render('cart', { user, isAdmin: user.role === 'admin', style: 'index.css',})
        }
        else {
            const cartId = await cartsService.getOneById(user.cart)

            const userCartId = user.cart
            
            res.render('cart', { 
                user,
                isAdmin: user.role === 'admin',
                userCartId,
                cartId,
                style: 'index.css',
            })
        }

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! DEVUELVE UN CARRITO A TRAVES DEL CID PASADO POR PARAMS
router.get('/:cid', async (req, res) => {
    try {
        const { cid } = req.params
        const user = req.user
        
        const cartId = await cartsService.getOneById(cid)
        
        res.render('cart', { 
            user,
            isAdmin: user.role === 'admin',
            cartId,
            style: 'index.css',
        })

        //res.json({ status: 'success', payload: cartId})
    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error: 'Carrito no Encontrado'  })
    }
})

//! CREA UN CARRITO CON UN ARRAY DE PRODUCTOS VACIO SINO SUMA CANTIDAD
router.post('/', passportCall('jwt'), authorization('premium'), async (req, res) => {
    try {
        const { email } = req.user
        const user = await User.findOne({email: email})

        const pid = req.body.productId
        const quantity = parseInt(req.body.quantity)
        
        if(user.role === 'premium') {
            const productBelongsToUser = await productsService.getOneByOwner({_id: pid, owner: email})
            if(productBelongsToUser) {
                return (
                    req.logger.error('Error:', new Error('No puedes agregar un producto que te pertenece')),
                    res
                    .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
                    .json({  status: 'error', error: 'No puedes agregar un producto que te pertenece'  })
            )}
        }

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
            const productAdded = await cartsService.insertInsideOne(user.cart, pid, quantity)
            
            res
            .status(HTTP_RESPONSES.CREATED)
            .json({ status: 'Success', payload: productAdded})
        }
        
    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! ELIMINAR DEL CARRITO EL PRODUCTO SELECCIONADO POR EL USUARIO
router.delete('/', passportCall('jwt'), authorization('premium'), async (req, res) => {
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
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! ELIMINAR TODOS LOS PRODUCTOS DEL CARRITO 
router.delete('/:cid', passportCall('jwt'), authorization('premium'), async (req, res) => {
    try {
        const { cid } = req.params

        const productsDeleted = await cartsService.deleteAll(cid)
        
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productsDeleted})

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! FINALIZAR EL PROCESO DE COMPRA DEL CARRITO
router.get('/:cid/purchase', passportCall('jwt'), authorization('premium'), async (req, res) => {
    try {
        const { cid } = req.params

        let cartId = await cartsService.getOneById(cid)

        if(!cartId) {
            return res
                .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
                .json({  status: 'error', error: 'Carrito no Encontrado'  })
        }
        
        const { newTicket, cartToUpdate } = await ticketService.purchase(cartId, cid, req.user.email)
        
        /* return res
            .status(HTTP_RESPONSES.CREATED)
            .json({ status: 'Success', payload: newTicket}) */

        req.logger.info('Purchase Made')
        res.render('purchase.handlebars', { 
                isTicket: newTicket.length !== 0,
                newTicket,
                cartToUpdate,
                style: 'index.css',
        })
        
        
    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

module.exports = router