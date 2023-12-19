const { Router } = require('express')
const ProductManager = require('../ProductManager');

const router = Router()
const productManager = new ProductManager("./src/productos.json");

router.get('/', async (req, res) => {

    const products = await productManager.getProducts()

    res.render('realTimeProducts', { 
        products, 
        style: 'index.css'
    })
})

module.exports = router;

