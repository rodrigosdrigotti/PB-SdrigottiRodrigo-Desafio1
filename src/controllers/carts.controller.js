const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const cartsService = require('../services/cart.service')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const carts = await cartsService.getAll()

        res.json({ status: 'success', payload: carts})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

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

router.post('/', async (req, res) => {
    try {
        const newCartInfo = {
            products: [],
        }

        const newCart = await cartsService.insertOne(newCartInfo)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: newCart})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params

        const productAdded = await cartsService.insertInsideOne(cid, pid)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productAdded})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.put('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params
        const { quantity } = req.body

        const productAdded = await cartsService.updateOne(cid, pid, quantity)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productAdded})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.delete('/:cid/product/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params

        const productDeleted = await cartsService.deleteOne(cid, pid)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productDeleted})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.delete('/:cid', async (req, res) => {
    try {
        const { cid } = req.params

        const productsDeleted = await cartsService.deleteAll(cid)
        
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productsDeleted})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

module.exports = router