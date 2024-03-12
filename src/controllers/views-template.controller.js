const { Router } = require('express')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')
const CurrentUserDto = require('../DTO/current-user.dto')

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

module.exports = router