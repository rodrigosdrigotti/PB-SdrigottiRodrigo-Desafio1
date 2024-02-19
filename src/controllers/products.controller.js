const { Router } = require('express')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const User = require('../DAO/models/user.model');
const Product = require('../DAO/models/product.nodel.js')
const passportCall = require('../utils/passport-call.util');
const authorization = require('../middlewares/authorization.middleware')

const router = Router()

router.get('/', passportCall('jwt'), authorization('user'), async (req, res) => {
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
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})



module.exports = router