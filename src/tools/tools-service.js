const ToolsService = {
    getAllTools(knex) {
      return knex.select('*').from('tools')
    },

}
  
module.exports = ToolsService