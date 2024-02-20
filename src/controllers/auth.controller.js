const { Router } = require('express')
const { generateToken } = require('../utils/jwt.util')
const User = require('../DAO/models/user.model')
const { useValidPassword, createHash } = require('../utils/crypt-password.util')
const passport = require('passport')

const router = Router()

router.post('/', async (req, res) => {
  try {       
    const { email, password } = req.body

    const user = await User.findOne({ email: email })
    if (!user){
      res.status(400).json({ status: 'error', error: 'Bad Request' })
    }

    if (!useValidPassword(user, password)) {
      return res.status(400).json({ status: 'error', error: 'Bad Request' })
    }

    const token = generateToken({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      cart: user.cart,
    })

    res 
      .cookie('authToken', token, {
        maxAge: 60000,
        httpOnly: true
      })
      .json({ status: 'Success', payload: 'Logged In'})
  
  } catch (error) {
    res
      .status(500)
      .json({ status: 'Success', message: 'Internal Server Error' })
  }
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({ status: 'Error', error: 'Bad Request'})

    const passwordEncrypted = createHash(password)

    await User.updateOne({email}, {password: passwordEncrypted})

    res.json({ status: 'Success', message: 'Password Updated'})

  } catch (error) {
    res
      .status(500)
      .json({ status: 'Success', message: 'Internal Server Error' })
  }
})

router.get('/logout', (req, res) => {
  res
    .clearCookie('authToken')
    .status(200)
    .json({ status: 'Success', payload: 'Logout Succesful'})
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {session: false}), 
  (req, res) => {

    const token = generateToken({
      email: req.user.email,
      first_name: req.user.first_name,
      githubUsername: req.user.githubUsername,
      role: req.user.role,
      cart: req.user.cart,
    })

    res 
      .cookie('authToken', token, {
        maxAge: 60000,
        httpOnly: true
      })
      //.json({ status: 'Success', payload: 'Logged In'})
      .redirect('/api/products')
  }
)

module.exports = router