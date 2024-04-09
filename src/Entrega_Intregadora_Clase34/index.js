const app = require('./server')
const { port } = require('./configs/server.config')
const { Server } = require('socket.io')
const Message = require("./DAO/models/messages.model");

const chats = []

const httpServer = app.listen(port, () => {
    console.log(`Server running at port 8080`)
})

const io = new Server(httpServer)

io.on('connection', socket => {
    socket.on('newUser', data => {
        socket.broadcast.emit('userConnected', data)
        socket.emit('messageLogs', chats)
    })

    socket.on('message', async data => {
        chats.push(data)

        io.emit('messageLogs', chats)
        try {
            const newMessageInfo = {
                user: data.username,
                message: data.message
            } 
            
            await Message.create(newMessageInfo)

        } catch (error) {
            console.log(error)
        }
    })
})