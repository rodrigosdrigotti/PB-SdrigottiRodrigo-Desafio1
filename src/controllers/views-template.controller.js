const { Router } = require('express')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')
const CurrentUserDto = require('../DTO/current-user.dto')
const generateProducts = require('../utils/products-mock.util')
const productsService = require('../services/product.service')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/index')
const User = require('../DAO/models/user.model')

const router = Router()

//! SIGNUP
router.get('/signup', async (req, res) => {
    try {
     res.render ('signup.handlebars', {style:'index.css'})   
    } catch (error) {
        req.logger.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/editUser/:uid', passportCall('jwt'), authorization(['admin']), async (req, res) => {
    try {
        const uid = req.params.uid
        const user = req.user

        res.render ('userRole-edit.handlebars', { user, isAdmin: user.role === 'admin', uid, style:'index.css' })   
    } catch (error) {
        req.logger.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! MUESTRA EL PROFILE DEL USUARIO LOGUEADO
router.get('/profile', passportCall('jwt'), authorization(['premium', 'user', 'admin']), async (req, res) => {
    try {
        const user = req.user
        res.render ('profile.handlebars', { user, isAdmin: user.role === 'admin' , style:'index.css'})   
    } catch (error) {
        req.logger.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! CAMBIO DE CONTRASEÑA OLVIDADA
router.get('/forgotPassword', async (req, res) => {
    try {
        res.render ('forgot-password.handlebars', { style:'index.css'})   
    } catch (error) {
        req.logger.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! RESETEO DE CONTRASEÑA OLVIDADA
router.get('/reset-password/:token', async (req, res) => {
    try {
        const { token } = req.params
    
        jwt.verify(token, jwtSecret, (error, credentials) => {
        
            if (error) return res.status(403).json({ error: 'Unauthorized' })

            const expirationTime = new Date(credentials.exp * 1000)
            
            const timeLeft = Math.floor((expirationTime - new Date()) / 1000)

            res.render ('reset-password.handlebars', { token, timeLeft, style:'index.css' })   
        })
    } catch (error) {
        req.logger.error('Error:', error)
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
        req.logger.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

//! AGREGAR NUEVOS PRODUCTOS
router.get('/addProduct', passportCall('jwt'), authorization('premium'), async (req, res) => {
    try {
        res.render ('add-product.handlebars', { style: 'index.css' })

    } catch (error) {
        req.logger.error('Error:', error)
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
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! PERMITE PROBAR TODOS LOS LOGS
router.get('/loggerTest', passportCall('jwt'), authorization('user'), (req, res) => {
    try {
        req.logger.debug('Debug message')
        req.logger.http('HTTP message')
        req.logger.info('Info message')
        req.logger.warning('Warning message')
        req.logger.error('Error message')
        req.logger.fatal('Fatal message')
        
        res.json({ status: 'sucess', message: 'Logs registrados correctamente. Ver consola' });

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! CAMBIAR DE ROL USER A PREMIUM
router.get('/users/premium/:uid', passportCall('jwt'), async (req, res) => {
    try {
        const { uid } = req.params

        const user = await User.findById(uid)

        if (!user) return res.status(400).json({ status: 'error', error: 'Bad Request' })
        
        user.role = user.role === 'user' ? 'premium' : 'user';

        await user.save()

        req.logger.info(`Role Cambiado a: ${user.role}`)
        res.json({ status: 'Success', payload: `Role cambiado a: ${user.role}`})

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! RECUPERAR USER ELIMINADO
router.get('/userRecovered/:token', async (req, res) => {
    try {
        const { token } = req.params
    
        jwt.verify(token, jwtSecret, (error, credentials) => {
        
            if (error) return res.status(403).json({ error: 'Unauthorized' })

            const expirationTime = new Date(credentials.exp * 1000)
            
            const timeLeft = Math.floor((expirationTime - new Date()) / 1000)
  
            res.render ('recover-user.handlebars', { token, timeLeft, style:'index.css'})  
        })
    } catch (error) {
        req.logger.error('Error:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router