const { Router } = require('express')
const CartManager = require('../CartManager');

const router = Router();
const cartManager = new CartManager("./src/carrito.json")

router.post('/', async (req, res) => {

    const cartToAdd = await cartManager.addCart()
        
    if(cartToAdd){
        res.json({ cartAdded: cartToAdd })
    }
    else{
        res.status(404).json({Error: "Producto no agregado"})
    }
})

router.get('/', async (req, res) => {
    
    const carts = await cartManager.getCart()

    if(carts.length === 0){
        res.status(404).json({Error: "Carrito Vacio"})
    } else {
        res.json({ carts: carts })
    }
})

router.get('/:cid', async (req, res) => {

    const { cid } = req.params

    const cartId = await cartManager.getCartProductsById(Number(cid))

    if(cartId){
        res.json({ carts: cartId.products })
    }
    else{
        res.status(404).json({Error: "Carrito no Encontrado"})
    }
})

router.post('/:cid/product/:pid', async (req, res) => {

    const { cid, pid } = req.params

    const productToAddCart = await cartManager.addProductToCart(Number(cid), Number(pid))
        
    if(productToAddCart){
        res.json({ productAdded: productToAddCart })
    }
    else{
        res.status(404).json({Error: "Carrito o Producto no encontado"})
    }
})

module.exports = router;