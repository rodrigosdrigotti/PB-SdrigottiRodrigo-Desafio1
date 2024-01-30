const { Router } = require('express')
const User = require('../DAO/models/user.model')

const router = Router()

router.post('/', async (req, res) => {
    try {
      const { email, password } = req.body
  
      const user = await User.findOne({ email })
      //console.log('🚀 ~ router.post ~ user:', user)
  
      if (!user) return res.status(401).json({ message: 'Unauthorized' })
  
      if (user.password !== password)
        return res.status(401).json({ message: 'Unauthorized' })
      
      req.session.user = {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      }
      
      res.json({ status: 'success', message: 'Login Succesful'})
  
    } catch (error) {
      res
        .status(500)
        .json({ status: 'success', message: 'Internal Server Error' })
    }
  })

  router.get('/logout', (req, res) => {
    req.session.destroy(err => {
      if(err) return res.json({error: err})

      res.json({ status: 'success', message: 'Logout Succesful'})
    })
  })

  module.exports = router