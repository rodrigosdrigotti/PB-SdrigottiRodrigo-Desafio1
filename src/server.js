const express = require('express')
const mongoConnect = require('./db')
const handlebars = require('express-handlebars')
const router = require('./router')
const cookieParser = require('cookie-parser')
const MongoStore = require('connect-mongo')
const session = require('express-session')
const { urlMongo } = require('./configs/urlMongo')

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(process.cwd() + '/src/public'))
app.use(
  session({
    secret: 'coderSecret',
    store: MongoStore.create({
      mongoUrl: urlMongo,
    }),
    resave: true,
    saveUninitialized: false
  })
)

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