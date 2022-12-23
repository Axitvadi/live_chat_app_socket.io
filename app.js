require('dotenv').config()
require('./config/db');
const express = require("express")
const app = express()
const MongoStore = require('connect-mongo');

const mongoStore = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    ttl: 24 * 60 * 60, // = 14 days. Default
})

const http = require('http')
const server = http.createServer(app)
const {Server} = require('socket.io')
const io = new Server(server)

const port = process.env.PORT || 3000
const socketHandler = require('./controllers/chatController')

const path = require('path')
const flash = require('connect-flash')
const router = require("./routes/index")
const session = require("express-session");
const passport = require('passport');
require('./config/passport')(passport);


app.use(express.json())
app.use(express.urlencoded({extended: false}))

// <<<<<<<<<<<<<<< SESSION >>>>>>>>>>>>>>>>>>>
const sessionMiddleware = session({
    secret: process.env.SECRET_KEY,
    store: mongoStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
    },
})

app.use(sessionMiddleware);

app.use(express.static(path.join(__dirname, 'public')))
app.use(flash())

app.set('view engine', 'ejs')

app.use(passport.session())
app.use(passport.initialize());

app.use(router)

server.listen(port, () => {
    console.log(`server successfully started at port ${port}`)
    console.log(`http://localhost:${port}`)
})

io.use(function (socket, next) {
    sessionMiddleware(socket.request, {}, next);
})
io.use(function (socket, next) {
    if (typeof socket.request.session.user === "undefined" || !socket.request.session.user) {
        const error = new Error("You are not authorized")
        return next(error)
    }
    next()
})
// run when user connect
io.on('connection', (socket) => {
    if (typeof socket.request.session.user !== "undefined") {
        socketHandler(socket, io)
    }
    socket.on("disconnect", () => {
        console.log("Disconnect")
    })
})
