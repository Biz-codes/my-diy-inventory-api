const path = require('path')
const express = require('express')
const xss = require('xss')
const ProjectsService = require('./projects-service')

const projectsRouter = express.Router()
const jsonParser = express.json()

const serializeProject = project => ({
  id: project.id,
  user_id: project.user_id,
  project_name: xss(project.project_name),
  supplies_needed: xss(project.supplies_needed),
  tools_needed: xss(project.tools_needed),
  instructions: xss(project.instructions),
  delivery_date: project.delivery_date,
  done: project.done
})

projectsRouter
  .route('/')
  .get((req, res, next) => {
    const knexInstance = req.app.get('db')
    ProjectsService.getAllProjects(knexInstance)
      .then(projects => {
        res.json(projects.map(serializeProject))
      })
      .catch(next)
  })

  module.exports = projectsRouter