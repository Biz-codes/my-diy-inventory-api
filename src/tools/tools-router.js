const path = require('path')
const express = require('express')
const xss = require('xss')
const ToolsService = require('./tools-service')

const toolsRouter = express.Router()
const jsonParser = express.json()

const serializeTool = tool => ({
  id: tool.id,
  user_id: tool.user_id,
  tool_name: xss(tool.supply_name),
  details: xss(tool.details),
  quantity: tool.quantity
})

toolsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ToolsService.getAllTools(knexInstance)
      .then(tools => {
        res.json(tools.map(serializeTool))
      })
      .catch(next)
  })

  module.exports = toolsRouter