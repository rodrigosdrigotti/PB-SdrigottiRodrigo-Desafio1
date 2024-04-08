const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/index')

const generateToken = user => {
    return jwt.sign(user, jwtSecret, {expiresIn: '1h'})
}

/* const authToken = (req, res, next) => {
    const { token } = req.params
    
    jwt.verify(token, jwtSecret, (error, credentials) => {
      
      if (error) return res.status(403).json({ error: 'Unauthorized' })

      const expirationTime = new Date(credentials.exp * 1000)
      
      const tiempoRestante = Math.floor((expirationTime - new Date()) / 1000);

      req.params.token = credentials
      
      next()
    })
} */

module.exports = {
    generateToken, 
    /* authToken */
}