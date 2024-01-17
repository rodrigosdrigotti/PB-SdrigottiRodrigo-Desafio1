const productsController = require('../controllers/products.controller')
const cartsController = require('../controllers/carts.controller')
const chatsController = require('../controllers/chats.controller')

const router = app => {
    app.use('/api/products', productsController)
    app.use('/api/carts', cartsController)
   /app.use('/api/chat', chatsController)
}

module.exports = router