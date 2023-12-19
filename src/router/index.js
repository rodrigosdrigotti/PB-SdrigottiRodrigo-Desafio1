const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')
const realTimeProductsController = require('../controllers/realTimeProducts.controller')

const router = app => {
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
    app.use('/realtimeproducts', realTimeProductsController)
}

module.exports = router