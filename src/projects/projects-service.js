const ProjectsService = {
    getAllProjects(knex) {
      return knex.select('*').from('projects')
    },

}
  
module.exports = ProjectsService