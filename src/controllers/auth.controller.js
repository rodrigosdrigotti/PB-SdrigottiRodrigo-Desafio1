const { Router } = require('express')
const { generateToken } = require('../utils/jwt.util')
const User = require('../DAO/models/user.model')
const { useValidPassword, createHash } = require('../utils/crypt-password.util')

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

    console.log(`Controller: ${user}`)

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

module.exports = router