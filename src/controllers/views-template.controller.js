const { Router } = require('express')
const passportCall = require('../utils/passport-call.util')
const authorization = require('../middlewares/authorization.middleware')

const router = Router()


router.get('/signup', async (req, res) => {
    try {
     res.render ('signup.handlebars', {style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/profile', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const user = req.user
        res.render ('profile.handlebars', { user , style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/forgotPassword', async (req, res) => {
    try {
        res.render ('forgot-password.handlebars', { style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/session/current', passportCall('jwt'), authorization('user'), async (req, res) => {
    try {
        const user = req.user

        res.json({ status: 'Success', payload: user})

    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router