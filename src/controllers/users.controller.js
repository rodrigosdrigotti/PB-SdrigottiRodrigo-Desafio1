const { Router } = require('express')
const passport = require('passport')

const router = Router()

router.post('/', passport.authenticate('register', {session: false}), async (req, res) => {
    try {
        res.status(201).json({ status: 'Success', message: `Registered Succesful` })

    } catch (error) {
        res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error'})
    }
})

router.get('/fail-register', (req, res) => {
    try {
        console.log('Fallo Registro')
        res.status(400).json({status: 'Error', error: 'Bad Request'})
    } catch (error) {
        res
        .status(500)
        .json({ status: 'Success', message: 'Internal Server Error'})
    }
})

module.exports = router