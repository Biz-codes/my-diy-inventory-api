require('dotenv').config()
let bodyParser = require("body-parser")
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const errorHandler = require("./middleware/error-handler");
const authRouter = require("./auth/auth-router");
const usersRouter = require('./users/users-router')
const suppliesRouter = require('./supplies/supplies-router')
const toolsRouter = require('./tools/tools-router')
const projectsRouter = require('./projects/projects-router')

const app = express()

app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test'
}))
app.use(cors())
app.use(helmet())

app.use(bodyParser.json());

//Load user login router
app.use("/api/auth", authRouter)
//Load user registration router
app.use('/api/users', usersRouter)
app.use('/api/supplies', suppliesRouter)
app.use('/api/tools', toolsRouter)
app.use('/api/projects', projectsRouter)

app.get('/', (req, res) => {
    res.send('Hello, world!')
})

//log errors for production
app.use(errorHandler);

module.exports = app;