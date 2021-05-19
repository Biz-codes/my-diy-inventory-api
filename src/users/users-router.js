const path = require('path')
const express = require('express')
const xss = require('xss')
const UsersService = require('./users-service.js')

const usersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = user => ({
    id: user.id,
    user_username: xss(user.user_username),
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

    .post(jsonParser, (req, res, next) => {
        const {
            user_username
        } = req.body
        const newUser = {
            user_username
        }

        for (const [key, value] of Object.entries(newUser)) {
            if (value == null) {
                return res.status(400).json({
                    error: {
                        message: `Missing '${key}' in request body`
                    }
                })
            }
        }
        
        UsersService.insertUser(
                req.app.get('db'),
                newUser
            )
            .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(serializeUser(user))
            })
            .catch(next)
    })

foldersRouter
    .route('/:folder_id')
    .all((req, res, next) => {
        FoldersService.getById(
                req.app.get('db'),
                req.params.folder_id
            )
            .then(folder => {
                if (!folder) {
                    return res.status(404).json({
                        error: {
                            message: `Folder doesn't exist`
                        }
                    })
                }
                res.folder = folder // save the article for the next middleware
                next() // don't forget to call next so the next middleware happens!
            })
            .catch(next)
    })
    .get((req, res, next) => {
        res.json({
            id: res.folder.id,
            folder_name: res.folder.folder_name,
        })
    })
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
                req.app.get('db'),
                req.params.folder_id
            )
            .then(() => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonParser, (req, res, next) => {
        const { folder_name } = req.body
        const folderToUpdate = { folder_name }

        const numberOfValues = Object.values(folderToUpdate).filter(Boolean).length
        if (numberOfValues === 0) {
            return res.status(400).json({
                error: {
                    message: `Request body must contain 'folder_name'`
                }
            })
    }

        FoldersService.updateFolder(
            req.app.get('db'),
            req.params.folder_id,
            folderToUpdate
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
                .catch(next)
    })

module.exports = foldersRouter