const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')
const authController = require('../controllers/auth.controller')
const viewsTemplateController = require('../controllers/views-template.controller')
const usersController = require('../controllers/users.controller')

const router = app => {
    app.use('/api/', viewsTemplateController)
    app.use('/api/auth', authController)
    app.use('/api/users', usersController)
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
}

module.exports = router