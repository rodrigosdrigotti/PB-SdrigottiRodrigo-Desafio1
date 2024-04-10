const HTTP_RESPONSES = require("../constants/http-responses.constant")
const productsService = require('../services/product.service')

const checkProductOwnership = async (req, res, next) => {
    try {
        const product = await productsService.getOneById(req.params.pid)
        
        if(!product) return res.status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR).json({ status: 'error', error })

        if(!req.user) return res.status(401).json({ status: 'error', error: 'Unauthorized'})

        if(req.user.role === 'admin' || (req.user.role === 'premium' && product.owner === req.user.email)) {
            req.product = product
            next()
        } else {
            return res.status(403).json({ status: 'error', error: 'Forbiden'})
        }

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
}

module.exports = checkProductOwnership