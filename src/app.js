const express = require('express');
const { port } = require('./config/server.config')
const handlebars = require('express-handlebars')
const { Server } = require('socket.io')
const router = require('./router')

const app = express();

app.use(express.json())
app.use(express.static(process.cwd() + '/src/public'))
//app.use(express.urlencoded({extended: true}))

router(app)

app.engine('handlebars', handlebars.engine())
app.set('views', process.cwd() + '/src/views')
app.set('view engine', 'handlebars')

const httpServer = app.listen(port, () => {
    console.log(`Server running at port ${port}`)
})

const io = new Server(httpServer)

io.on('connection', socket => {
    console.log(`Usuario con id: ${socket.id} conectado`)

    io.emit('updateProducts', 'fuck');
})