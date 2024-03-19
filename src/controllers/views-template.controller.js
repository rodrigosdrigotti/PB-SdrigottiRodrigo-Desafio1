const { Router } = require('express')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')
const CurrentUserDto = require('../DTO/current-user.dto')
const generateProducts = require('../utils/products-mock.util')
const productsService = require('../services/product.service')

const router = Router()

//! SIGNUP
router.get('/signup', async (req, res) => {
    try {
     res.render ('signup.handlebars', {style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! MUESTRA EL PROFILE DEL USUARIO LOGUEADO
router.get('/profile', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const user = req.user
        res.render ('profile.handlebars', { user , style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! CAMBIO DE CONTRASEÑA OLVIDADA
router.get('/forgotPassword', async (req, res) => {
    try {
        res.render ('forgot-password.handlebars', { style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! DEVUELVE UN DTO DEL USUARIO LOGUEADO CON LA INFORMACION NECESARIA
router.get('/current', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const user = req.user
        const userCurrent = new CurrentUserDto(user)

        res.json({ status: 'Success', payload: userCurrent})

    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! AGREGAR NUEVOS PRODUCTOS
router.get('/addProduct', passportCall('jwt'), authorization('admin'), async (req, res) => {
    try {
        res.render ('add-product.handlebars', { style: 'index.css' })

    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! PARA EL MOCKING DE PRODUCTOS
router.get('/mockingProducts', passportCall('jwt'), authorization('admin'), async (req, res) => {
    try {
        //* PRIMERO SE ELIMINAN LOS PRODUCTOS
        const productsDeleted = await productsService.deleteAll()

        if(productsDeleted) {

            const { numProds = 100 } = req.query
    
            const allProducts = generateProducts(numProds)
            
            //* SE AGREGAN LOS PRODUCTOS A LA BD
            const allProductsAdded = await productsService.addAllProducts(allProducts)
            
            res.json({ status: 'success', payload: allProductsAdded})
        }

    } catch (error) {
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

module.exports = router