const express = require('express')
const mongoConnect = require('./db')
const router = require('./router')
const cookieParser = require('cookie-parser')
const initializePassport = require('./configs/passport.config')
const passport = require('passport')
const handlebars = require('express-handlebars')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(process.cwd() + '/src/public'))
app.use(cookieParser())

initializePassport()
app.use(passport.initialize())

app.engine('handlebars', handlebars.engine({
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowProtoMethodsByDefault: true,
    },
}))
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

router(app)

mongoConnect()

module.exports = app