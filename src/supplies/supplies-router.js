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


suppliesRouter
  .route("/my-supplies/:user_id")
  .all((req, res, next) => {
    if (isNaN(parseInt(req.params.user_id))) {
      return res.status(404).json({
          error: {
              message: `Invalid id`,
          },
      });
  }
  SuppliesService.getSuppliesByUserId(
    req.app.get("db"), req.params.user_id)
      .then((supplies) => {
        res.json(supplies.map(serializeSupply))
          })
          .catch(next);
 

})


suppliesRouter
  .route('/:supply_id')
  .all((req, res, next) => {
    SuppliesService.getById(
      req.app.get('db'),
      req.params.supply_id
    )
      .then(supply => {
        if (!supply) {
          return res.status(404).json({
            error: { message: `Supply doesn't exist` }
          })
        }
        res.supply = supply
        next()
      })
      .catch(next)
  })
  .get((req, res, next) => {
    res.json(serializeSupply(res.supply))
  })
  
  .delete((req, res, next) => {
    SuppliesService.deleteSupply(
      req.app.get('db'),
      req.params.supply_id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })
  
  .patch(jsonParser, (req, res, next) => {
    const { user_id, supply_name, details, quantity } = req.body
    const supplyToUpdate = { user_id, supply_name, details, quantity }

    const numberOfValues = Object.values(supplyToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must contain either 'supply_name', 'details', or 'quantity'.`
        }
      })

    SuppliesService.updateSupply(
      req.app.get('db'),
      req.params.supply_id,
      supplyToUpdate
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
      
  })

module.exports = suppliesRouter