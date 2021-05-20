const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service.js')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    name: xss(user.name),
    email: xss(user.email),
    username: xss(user.username),
    password: xss(user.password)
})

usersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        UsersService.getAllUsers(knexInstance)
            .then(users => {
                res.json(users.map(serializeUser))
            })
            .catch(next)
    })

//     .post(jsonParser, (req, res, next) => {
//         const {
//             user_username
//         } = req.body
//         const newUser = {
//             user_username
//         }

//         for (const [key, value] of Object.entries(newUser)) {
//             if (value == null) {
//                 return res.status(400).json({
//                     error: {
//                         message: `Missing '${key}' in request body`
//                     }
//                 })
//             }
//         }
        
//         UsersService.insertUser(
//                 req.app.get('db'),
//                 newUser
//             )
//             .then(user => {
//                 res
//                     .status(201)
//                     .location(path.posix.join(req.originalUrl, `/${user.id}`))
//                     .json(serializeUser(user))
//             })
//             .catch(next)
//     })



module.exports = usersRouter