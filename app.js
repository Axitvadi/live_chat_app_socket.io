require('dotenv').config()
require('./config/db');
const express = require("express")
const app = express()
const http = require('http')
const server = http.createServer(app)
const { Server } = require('socket.io')
const io = new Server(server)
const port = process.env.PORT || 3000

const path = require('path')
const flash = require('connect-flash')
const router = require("./routes/index")
const session = require("express-session");
const passport =require('passport');
require('./config/passport')(passport); 



app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// <<<<<<<<<<<<<<< SESSION >>>>>>>>>>>>>>>>>>>
app.use(
    session({
      secret: process.env.SECRET_KEY,
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 1000 * 60 * 60 * 24,
      },
    })
  );

app.use(express.static(path.join(__dirname,'public')))
app.use(flash())

app.set('view engine','ejs')


app.use(passport.session())
app.use(passport.initialize());

app.use(router)

server.listen(port, () => {
    console.log(`server successfully started at port ${port}`)
    console.log(`http://localhost:${port}`)
})



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

