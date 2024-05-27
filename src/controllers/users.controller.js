const { Router } = require('express')
const passport = require('passport')
const passportCall = require('../utils/passport-call.util');
const authorization = require('../middlewares/authorization.middleware')
const User = require('../DAO/models/user.model')
const messageManager = require('../repository')
const HTTP_RESPONSES = require('../constants/http-responses.constant')
const userService = require('../services/users.service')
const jwt = require('jsonwebtoken')
const { jwtSecret } = require('../configs/index')

const router = Router()

//! REGISTRO DE USUARIO
router.post('/', passport.authenticate('register', {session: false}), async (req, res) => {
    try {
        req.logger.info('Registered Succesful')
        res.status(201).json({ status: 'Success', message: `Registered Succesful` })
    } catch (error) {
        res
        .status(500)
        .json({ status: 'error', message: 'Internal Server Error'})
    }
})

//! FALLO DE REGISTRO DE USUARIO
router.get('/fail-register', (req, res) => {
    try {
        res.status(400).json({status: 'Error', error: 'Bad Request'})
    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(500)
        .json({ status: 'Success', message: 'Internal Server Error'})
    }
})

//! DEVUELVE TODOS LOS USUARIOS

router.get('/', passportCall('jwt'), authorization(['admin']), async (req, res) => {
    try {
        const users = await userService.getAll()
        const user = req.user
        
        const usersFiltered = users.filter(user => user.status !== false)

        res.render('user.handlebars', {
            user,
            isAdmin: user.role === 'admin',
            usersFiltered,
            style: 'index.css'
        })

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }

})

//! DEVUELVE UN USUARIO POR ID

router.get('/:uid', passportCall('jwt'), authorization(['admin']), async (req, res) => {
    try {
        const uid = req.params.uid
        const userFound = await User.findById(uid)

        if (!userFound || userFound.status === false){
            res.status(400).json({ status: 'error', error: 'Bad Request' })
        }

        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: userFound})

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }

})


//! ELIMINA USUARIO SIN CONEXION POR 2 DIAS
router.delete('/', passportCall('jwt'), authorization(['admin']), async (req, res) => {
    try {
        const inactiveUsers = await User.find({
            //updatedAt: { $lt: new Date(Date.now() - 48 * 60 * 60 * 1000) } // Busca usuarios que no han tenido conexión en las últimas 48 horas
            updatedAt: { $lt: new Date(Date.now() - 5 * 60 * 1000) } // Busca usuarios que no han tenido conexión en las últimas 5 minutos
        });

        // Envía un correo electrónico a cada usuario inactivo y elimínalos
        inactiveUsers.forEach(async (user) => {
            
            await messageManager.sendMessage(user, 1)
            
            const newStatus = { status: false }
            await User.findByIdAndUpdate({_id: user._id}, newStatus)
        })

        req.logger.info('User Inactive Deleted')
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'success',  message: 'Usuarios inactivos eliminados correctamente.' })

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! ELIMINA EL USUARIO POR UID
router.delete('/:uid', passportCall('jwt'), authorization(['admin']), async (req, res) => {
    try {
        const uid = req.params.uid
        const newStatus = { status: false }
        const newupdatedAt = { updatedAt: new Date() }
        const userDelete = await userService.updateOne(uid, newStatus, newupdatedAt)
        
        req.logger.info('User Deleted')
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: userDelete})
        
    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! ACTUALIZAR EL ROL DE UN USER SI SOS ADMIN
router.put('/:uid', passportCall('jwt'), authorization(['admin']), async (req, res) => {
    try {
        const uid = req.params.uid
        const newRole = req.body.userRole
        const newupdatedAt = { updatedAt: new Date() }

        const userUpdated = await userService.updateOne(uid, newRole, newupdatedAt)

        req.logger.info('User Role Updated')
        res
        .status(HTTP_RESPONSES.CREATED)
        .json({ status: 'Success', payload: userUpdated})

    } catch (error) {
        req.logger.error('Error:', error)
        res
        .status(HTTP_RESPONSES.INTERNAL_SERVER_ERROR)
        .json({  status: 'error', error  })
    }
})

//! RECUPERAR USER
router.post('/recoverUser', async (req, res) => {
    try {  
        const { token, email } = req.body
        
        const emailVerify = jwt.verify(token, jwtSecret, (error, credentials) => {
        
        if (error) return res.status(403).json({ error: 'Unauthorized' })
            
            return credentials.email
        })
        
        if(email === emailVerify){
            const user = await userService.findOne({ email: emailVerify })
        
            if (!user){
                res.status(400).json({ status: 'error', error: 'Bad Request' })
            }
            
            user.status = true
            
            await user.save()
      
            req.logger.info('User Recovered')
            res.json({ status: 'Success', message: 'User Recovered'})
        } 
  
    } catch (error) {
        req.logger.error('Error:', error)
        res
          .status(500)
          .json({ status: 'error', message: 'Internal Server Error' })
    }
    
  })

module.exports = router