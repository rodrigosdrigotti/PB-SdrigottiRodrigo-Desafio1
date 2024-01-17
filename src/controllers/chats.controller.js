const { Router } = require('express')

const router = Router()

router.get('/', (req, res) => {
    res.render('chat.handlebars', {style: 'index.css'})
})

module.exports = router