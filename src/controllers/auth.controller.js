const { Router } = require('express')
const User = require('../DAO/models/user.model')
const { createHash } = require('../utils/crypt-password.util')
const passport = require('passport')

const router = Router()

router.post('/',passport.authenticate('login', {failureRedirect: '/api/auth/fail-login'}) , async (req, res) => {
  try {       
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      email: req.user.email,
      role: req.user.role,
    }
      
    res.json({ status: 'success', message: 'Login Succesful'})
  
  } catch (error) {
    res
      .status(500)
      .json({ status: 'success', message: 'Internal Server Error' })
  }
})

router.get('/fail-login', (req, res) => {
  try {
    console.log('Fallo el Login')
    res.status(400).json({status: 'Error', error: 'Bad Request'})
  } catch (error) {
      res
      .status(500)
      .json({ status: 'success', message: 'Internal Server Error'})
  }  
})

router.get('/logout', (req, res) => {
  req.session.destroy(err => {
    if(err) return res.json({error: err})

    res.json({ status: 'success', message: 'Logout Succesful'})
  })
})

router.post('/forgot-password', async (req, res) => {
  try {
    const { email, password } = req.body
    if(!email || !password) return res.status(400).json({ status: 'Error', error: 'Bad Request'})

    const passwordEncrypted = createHash(password)

    await User.updateOne({email}, {password: passwordEncrypted})

    res.json({ status: 'success', message: 'Password Updated'})

  } catch (error) {
    res
      .status(500)
      .json({ status: 'success', message: 'Internal Server Error' })
  }
})

router.get('/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {})

router.get('/githubcallback', passport.authenticate('github', {failureRedirect: '/api/login'}), 
  (req, res) => {
    req.session.user = req.user
    res.redirect('/api/products')
  }
)

module.exports = router