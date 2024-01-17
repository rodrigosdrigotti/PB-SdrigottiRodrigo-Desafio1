const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const productsService = require('../services/product.service')

const router = Router()

router.get('/', async (req, res) => {
    try {
        const products = await productsService.getAll()
        
        res.render('home', { 
            products, 
            style: 'index.css',
        })
        //res.json({ status: 'success', payload: products})

    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.get('/:pid', async (req, res) => {
    try {
        const { pid } = req.params

        const productFound = await productsService.getOneById(pid)

        res.render('home', { 
            productFound, 
            style: 'index.css',
        })

        //res.json({ status: 'success', payload: productFound})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})
   
router.post('/', async (req, res) => {
    try {
        const { title, description, code, price, stock, category } = req.body
        if(!title || !description || !code || !price || !stock || !category)
            res
            .status(HTTP_RESPONSES.BAD_REQUEST)
            .json({ status: 'error', error: HTTP_RESPONSES.BAD_REQUEST_CONTENT})

        const newProductInfo = {
            title,
            description,
            code,
            price,
            stock,
            category,
        } 

        const newProduct = await productsService.insertOne(newProductInfo)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: newProduct})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.put('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const { title, description, code, price, stock, status, category  } = req.body
        if(!title || !description || !code || !price || !stock || !category)
            res
            .status(HTTP_RESPONSES.BAD_REQUEST)
            .json({ status: 'error', error: HTTP_RESPONSES.BAD_REQUEST_CONTENT})

            const productInfo = {
                title,
                description,
                code,
                price,
                stock,
                status,
                category,
                updatedAt: new Date(),
            } 
            
            const productUpdate = await productsService.updateOne(pid, productInfo)
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productUpdate})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.delete('/:pid', async (req, res) => {
    try {
        const { pid } = req.params
        const newStatus = { status: false }
        const productDelete = await productsService.deleteOne(pid, newStatus)
        
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productDelete})
    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

module.exports = router