const { Router } = require('express')
const { generateToken } = require('../utils/jwt.util')
const User = require('../DAO/models/user.model')
const { useValidPassword, createHash } = require('../utils/crypt-password.util')
const passport = require('passport')
const transport = require('../utils/nodemailer.util')
const serviceEmail = require('../configs/services.config')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/index')

const router = Router()

//! LOGIN DE USUARIO Y GENERACION DEL TOKEN
router.post('/', async (req, res) => {
  try {       
    const { email, password } = req.body

    const user = await User.findOne({ email: email })
  
    if (!user){
      res.status(400).json({ status: 'error', error: 'Bad Request' })
    }

    if(user.status === false){
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

    const newupdatedAt = { updatedAt: new Date() }
    
    await User.updateOne({_id: user._id}, newupdatedAt)
    
    req.logger.info('Success Logged In')
    res 
      .cookie('authToken', token, {
        maxAge: 90000,
        httpOnly: true
      })
      .json({ status: 'Success', payload: 'Logged In'})
  
  } catch (error) {
    req.logger.error('Error:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' })
  }
})

//! ENVIO DE TOKEN LINK PARA CAMBIO DE CONTRASEÑA OLVIDADA
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body

    if(!email) return res.status(400).json({ status: 'Error', error: 'Bad Request'})

    const user = await User.findOne({ email: email })
  
    if (!user) return res.status(400).json({ status: 'error', error: 'Bad Request' })
    
    const token = generateToken({
      email: user.email,
      first_name: user.first_name,
      last_name: user.last_name,
      role: user.role,
      cart: user.cart,
    })

    //const resetLink = `http://localhost:8080/api/reset-password/${token}`;

    const resetLink = `https://pb-sdrigottirodrigo-ecommerce-production.up.railway.app/api/reset-password/${token}`;

    transport.sendMail({
      from: serviceEmail.email.identifier,
      to: user.email,
      subject: 'Restablecer Contraseña',
      html: `
            <h1>Hola ${user.first_name}!!!</h1>
            <div>Haga click en el siguiente link si desea restablecer su Contraseña</div>
            <button><a href="${resetLink}">Restablecer</a></button>
            <div>
            `,
    })

    req.logger.info('Link Sent Successfully')
    res 
      .cookie('authToken', token, {
        maxAge: 60000,
        httpOnly: true
      })
      .json({ status: 'Success', payload: 'Link Sent'})

  } catch (error) {
    req.logger.error('Error:', error)
    res
      .status(500)
      .json({ status: 'error', message: 'Internal Server Error' })
  }
})

//! GENERAR LA CONTRASEÑA NUEVA
router.post('/reset-password', async (req, res) => {
  try {  
    const { token, password } = req.body

    const email = jwt.verify(token, jwtSecret, (error, credentials) => {
        
      if (error) return res.status(403).json({ error: 'Unauthorized' })
      
      return credentials.email
    })

    const user = await User.findOne({ email: email })
  
    if (!user){
      res.status(400).json({ status: 'error', error: 'Bad Request' })
    }

    if (useValidPassword(user, password)) {
      return res.status(400).json({ status: 'error', error: 'Bad Request' })    
    }
  
    const passwordEncrypted = createHash(password)

    await User.updateOne({email}, {password: passwordEncrypted})

    req.logger.info('Password Updated')
    res.json({ status: 'Success', message: 'Password Updated'})

  } catch (error) {
      req.logger.error('Error:', error)
      res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error' })
  }
  
})

//! LOGOUT DE USUARIO
router.get('/logout', (req, res) => {
  req.logger.info('Logout Succesful')
  res
    .clearCookie('authToken')
    .status(200)
    .json({ status: 'Success', payload: 'Logout Succesful'})
})

//! LOGIN CON GITHUB
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

    req.logger.info('Login Succesful')
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