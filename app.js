const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const path = require('path')

const io = new Server(server)
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

app.use(express.static(path.join(__dirname,'public')))

// run when user connect
io.on('connection', (socket) => {
    //msg to join user
    socket.emit('message','Welcome to chat !')

    // to all users accept join user
    socket.broadcast.emit('message','User has Joined chat !')

    // when user disconnect
    socket.on('disconnect', () =>{
    //message to all users
        io.emit('message','A user has left the chat')
    })
})

server.listen(port, () => {
    console.log(`server successfully started at port ${port}`)
    console.log(`http://localhost:${port}`)
})
