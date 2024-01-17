const express = require('express')
const mongoConnect = require('./db')
const handlebars = require('express-handlebars')
const router = require('./router')

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(process.cwd() + '/src/public'))

app.engine('handlebars', handlebars.engine({
    //defaultLayout: "main",
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