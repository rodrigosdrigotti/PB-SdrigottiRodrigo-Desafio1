const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const Product = require('../DAO/models/product.nodel.js')
const passportCall = require('../utils/passport-call.util');
const authorization = require('../middlewares/authorization.middleware')
const NewProductDto = require('../DTO/new-product.dto')
const productsService = require('../services/product.service')
const CustomError = require('../handlers/errors/Custom-Error.js')
const ErrorCodes = require('../handlers/errors/enum-errors')
const generateProductErrorInfo = require('../handlers/errors/generate-product-error-info')
const TYPES_ERROR = require('../handlers/errors/types.errors');
const checkProductOwnership = require('../middlewares/checkProductOwnership.middleware.js');

const router = Router()

//! DEVUELVE TODOS LOS PRODUCTOS
router.get('/', passportCall('jwt'), authorization('premium'), async (req, res) => {
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
        const user = req.user
        
        res.render('home.handlebars', { 
            user,
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
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! AGREGAR UN PRODUCTO SI SOS ADMIN CON POST
router.post('/', passportCall('jwt'), authorization('premium'), async (req, res, next) => {
    try {
        const { title, description, code, price, stock, category } = req.body
        let { owner } = req.body

        if(owner === 'si') {

            owner = req.user.email

            if( !title || !description || !code || !price || !stock || !category || !owner ) {
                CustomError.createError({
                    name: TYPES_ERROR.PRODUCT_CREATION_ERROR,
                    cause: generateProductErrorInfo({ title, description, code, price, stock, category, owner }),
                    message: 'Error Creating A Product',
                    code: ErrorCodes.INVALID_PRODUCT_INFO,
                })
            }
        
            const newProductInfo = new NewProductDto({title, description, code, price, stock, category, owner})
            
            const newProduct = await productsService.insertOne(newProductInfo)
                
            res
            .status(HTTP_RESPONSES.CREATED)
            .json({ status: 'success', payload: newProduct})
        }
        else if(owner === 'no'){
            const newProductInfo = new NewProductDto({title, description, code, price, stock, category})
            
            const newProduct = await productsService.insertOne(newProductInfo)
                
            res
            .status(HTTP_RESPONSES.CREATED)
            .json({ status: 'success', payload: newProduct})
        }

    } catch (error) {
        req.logger.error('Error:', error)
        next(error);
    }
})

//! ACTUALIZAR UN PRODUCTO SI SOS ADMIN
router.put('/:pid', passportCall('jwt'), checkProductOwnership/* authorization('admin') */, async (req, res) => {
    try {
        const { pid } = req.params
        const updatedAt = new Date()

        const productInfo = new NewProductDto(req.body, updatedAt)
        
        const productUpdate = await productsService.updateOne(pid, productInfo)

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productUpdate})

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! BORRAR UN PRODUCTO POR ID SI SOS ADMIN
router.delete('/:pid', passportCall('jwt'), checkProductOwnership/* authorization('admin') */, async (req, res) => {
    try {
        const { pid } = req.params
        const newStatus = { status: false }
        const productDelete = await productsService.deleteOne(pid, newStatus)
        
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success', payload: productDelete})
        
    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

module.exports = router