const ToolsService = {
    getAllTools(knex) {
      return knex.select('*').from('tools')
    },


  
  insertTool(knex, newTool) {
    return knex
      .insert(newTool)
      .into('tools')
      .returning('*')
      .then(rows => {
        return rows[0]
      })
  },
}

module.exports = ToolsService