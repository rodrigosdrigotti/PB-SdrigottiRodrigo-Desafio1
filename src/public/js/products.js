const socket = io()

socket.on('updateProducts', data => {
    console.log(data)
})