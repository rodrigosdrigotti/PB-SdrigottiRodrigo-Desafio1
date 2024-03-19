const express = require('express')
const MongoConnect = require('./db')
const router = require('./router')
const cookieParser = require('cookie-parser')
const initializePassport = require('./configs/passport.config')
const passport = require('passport')
const handlebars = require('express-handlebars')
const compression = require('express-compression')
const errorMiddleware = require('./middlewares/errors/index')

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
app.use(compression({
  brotli: {enabled: true, zlib: {}}
}))

router(app)

//app.use(errorMiddleware)

MongoConnect.getInstance()

module.exports = app