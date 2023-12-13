const { Router } = require('express')
const ProductManager = require('../ProductManager');
const { convertToNumber } = require('../middlewares/convert-to-number.middleware');

const router = Router();
const productManager = new ProductManager("./src/productos.json");

router.get('/', async (req, res) => {
    
    const { limit } = req.query

    const products = await productManager.getProducts()
    
    if(limit) {
        return res.json({products: products.slice(0,limit)})
    }

    res.json({ products: products })
})

router.get('/:pid', convertToNumber, async (req, res) => {

    const { pid } = req.params

    const productId = await productManager.getProductsById(pid)

    if(productId){
        res.json({ products: productId })
    }
    else{
        res.status(404).json({Error: "Producto no Encontrado"})
    }
})

router.post('/', async (req, res) => {

    const product = req.body

    const productToAdd = await productManager.addProduct(product)
    
    if(productToAdd){
        res.json({ productAdded: product })
    }
    else{
        res.status(404).json({Error: "Producto no agregado"})
    }
})

router.put('/:pid', convertToNumber, async (req, res) => {

    const { pid } = req.params
    const dataToUpdate = req.body
    
    const productUpdate = await productManager.updateProduct(pid, dataToUpdate)

    if(productUpdate){
        res.json({ productUpdated: productUpdate })
    }
    else{
        res.status(404).json({Error: "Producto no Encontrado"})
    }
})

router.delete('/:pid', convertToNumber, async (req, res) => {
    const { pid } = req.params

    const productDeleted = await productManager.deleteProduct(pid)
    console.log(productDeleted)
    if(productDeleted){
        res.json({ message: "Producto Eliminado" })
    }
    else{
        res.status(404).json({Error: "Producto no Encontrado"})
    }
})

module.exports = router;