const path = require('path')
const express = require('express')
const xss = require('xss')
const SuppliesService = require('./supplies-service')

const suppliesRouter = express.Router()
const jsonParser = express.json()

const serializeSupply = supply => ({
  id: supply.id,
  user_id: supply.user_id,
  supply_name: xss(supply.supply_name),
  details: xss(supply.details),
  quantity: supply.quantity
})

suppliesRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    SuppliesService.getAllSupplies(knexInstance)
      .then(supplies => {
        res.json(supplies.map(serializeSupply))
      })
      .catch(next)
  })


  
  .post(jsonParser, (req, res, next) => {
    const { user_id, supply_name, details, quantity } = req.body
    const newSupply = { user_id, supply_name, details, quantity }

    for (const [key, value] of Object.entries(newSupply))
      if (value == null)
        return res.status(400).json({
          error: { message: `Missing '${key}' in request body` }
        })

    SuppliesService.insertSupply(
      req.app.get('db'),
      newSupply
    )
      .then(supply => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${supply.id}`))
          .json(serializeSupply(supply))
      })
      .catch(next)
  })

// notesRouter
//   .route('/:note_id')
//   .all((req, res, next) => {
//     NotesService.getById(
//       req.app.get('db'),
//       req.params.note_id
//     )
//       .then(note => {
//         if (!note) {
//           return res.status(404).json({
//             error: { message: `Note doesn't exist` }
//           })
//         }
//         res.note = note
//         next()
//       })
//       .catch(next)
//   })
//   .get((req, res, next) => {
//     res.json(serializeNote(res.note))
//   })
//   .delete((req, res, next) => {
//     NotesService.deleteNote(
//       req.app.get('db'),
//       req.params.note_id
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })
//   .patch(jsonParser, (req, res, next) => {
//     const { note_name, content, date_modified, folder_id } = req.body
//     const noteToUpdate = { note_name, content, date_modified, folder_id }

//     const numberOfValues = Object.values(noteToUpdate).filter(Boolean).length
//     if (numberOfValues === 0)
//       return res.status(400).json({
//         error: {
//           message: `Request body must contain either 'note_name', 'content' or 'folder_id'`
//         }
//       })

//     NotesService.updateNote(
//       req.app.get('db'),
//       req.params.note_id,
//       noteToUpdate
//     )
//       .then(numRowsAffected => {
//         res.status(204).end()
//       })
//       .catch(next)
//   })

module.exports = suppliesRouter