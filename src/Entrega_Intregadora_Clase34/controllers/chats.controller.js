const { Router } = require('express')
const passportCall = require('../utils/passport-call.util');
const authorization = require('../middlewares/authorization.middleware')

const router = Router()

router.get('/', passportCall('jwt'), authorization('user'), async (req, res) => {
    res.render('chat.handlebars', {style: 'index.css'})
})

module.exports = router