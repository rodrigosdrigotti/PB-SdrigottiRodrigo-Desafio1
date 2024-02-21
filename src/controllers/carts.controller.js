const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const cartsService = require('../services/cart.service')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')
const User = require('../DAO/models/user.model')

const router = Router()

//Devuelve todos los carritos de compras del USUARIO LOGUEADO
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

//Devuelve un carrito a traves del CID pasado por parametro
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

//Crea un carrito con un array de productos vacio
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

//Eliminar del carrito el producto seleccionado por USUARIO.
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
//Eliminar del carrito el producto seleccionado.
/* router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params

        const productDeleted = await cartsService.deleteOne(cid, pid)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: productDeleted})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
}) */

//Eliminar todos los productos del carrito 
router.delete('/:cid', async (req, res) => {
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

module.exports = router