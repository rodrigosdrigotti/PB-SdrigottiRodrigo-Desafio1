const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const productsService = require('../services/product.service')
const Product = require("../DAO/models/product.nodel");
const allProductsToAdd = require('../products.json')

const router = Router()

//Para poder ingresar el JSON de 20 productos de ejemplo
router.post('/insertProducts', async (req, res) => {
    try {
        const allProductsAdded = await productsService.addAllProducts(allProductsToAdd)

        res.json({ status: 'success', payload: allProductsAdded})

    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

router.get('/', async (req, res) => {
    try {
        const limit = Number(req.query.limit) || 10
        const page = Number(req.query.page) || 1
        const sortDirection = req.query.sort === 'desc' ? -1 : 1
        const sort = req.query.sort ? { price: sortDirection } : undefined;
        const filter = {};

        if (req.query.category) {
            filter.category = req.query.category
        }

        if (Boolean(req.query.available)) {
            filter.available = req.query.available
        }
        
        const {docs, pages, hasPrevPage, hasNextPage, prevPage, nextPage} = await Product.paginate(filter, {limit, page, sort, lean: true})
        const products = docs
        
        res.render('home', { 
            products,
            totalPages: pages,
            prevPage,
            nextPage,
            page,
            hasPrevPage,
            hasNextPage,
            prevLink: hasPrevPage ? `?page=${prevPage}&limit=${limit}` : null,
            nextLink: hasNextPage ? `?page=${nextPage}&limit=${limit}` : null,
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

//Para poder eliminar los 20 productos de ejemplo
router.delete('/', async (req, res) => {
    try {
        const productsDeleted = await productsService.deleteAll()
        
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