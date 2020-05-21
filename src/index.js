require('./db/mongoose')
const express = require('express')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const app = express()
const config = require('../config')

const userRouter = require('./routers/user')
const menuRouter = require('./routers/menu')
const menuItemRouter = require('./routers/menuItem')
const orderRouter = require('./routers/order')
const restaurantRouter = require('./routers/restaurant')
const handleRouter = require('./routers/handler')
//Parsing the requests
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = config.server.port
//cookies
app.use(cookieParser())

//session
app.use(session({
    name: 'server-session',
    secret: 'thisisanothersecretformyapp',//process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false,maxAge: 3600000}, //secure flag means that the cookie will be set on Https only
}))
app.set('trust proxy', true) // trust first proxy

//Routers in use
app.use(userRouter)
app.use(menuRouter)
app.use(menuItemRouter)
app.use(orderRouter)
app.use(restaurantRouter)
//this should always be below other routers
app.use(handleRouter)
//app.set('trust proxy', true) 
app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
