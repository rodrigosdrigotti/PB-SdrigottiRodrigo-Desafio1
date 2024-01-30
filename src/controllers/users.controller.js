const { Router } = require('express')
const User = require('../DAO/models/user.model')
const io = require('socket.io-client')
const socket = io('http://localhost:8080')

const router = Router()

router.post('/', async (req, res) => {
    try {
        const { first_name, last_name, email, password, password_confirm } = req.body

        if(password !== password_confirm) return res.status(400).json({ message: 'Bad request' })

        const newUserInfo = {
            first_name, 
            last_name, 
            email, 
            password
        }

        const user = await User.create(newUserInfo)
        
        socket.emit('newUserDB', {user})

        res.status(201).json({ status: 'success', message: 'Registered Succesful'})

    } catch (error) {
        res
        .status(500)
        .json({ status: 'success', message: 'Internal Server Error'})
    }
})

module.exports = router