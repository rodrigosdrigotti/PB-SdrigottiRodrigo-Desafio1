const { Router } = require('express')
const privateAccess = require('../middlewares/private-access.middleware')
const publicAccess = require('../middlewares/public-access.middleware')

const router = Router()

router.get('/login', publicAccess, async (req, res) => {
    try {
     res.render ('login.handlebars', {style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/signup', publicAccess, async (req, res) => {
    try {
     res.render ('signup.handlebars', {style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/profile', privateAccess, async (req, res) => {
    try {
        const { user } = req.session
        res.render ('profile.handlebars', { user , style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

router.get('/forgotPassword', publicAccess, async (req, res) => {
    try {
        const { user } = req.session
        res.render ('forgot-password.handlebars', { user , style:'index.css'})   
    } catch (error) {
        console.error ('Error:', error.message)
        res.status(500).json({ error: 'Internal Server Error' })
    }
})

module.exports = router