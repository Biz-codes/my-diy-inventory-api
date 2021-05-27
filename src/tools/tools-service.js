const ToolsService = {
  getAllTools(knex) {
    return knex.select("*")
      .from("tools");
  },

  insertTool(knex, newTool) {
    return knex
      .insert(newTool)
      .into("tools")
      .returning("*")
      .then((rows) => {
        return rows[0];
      });
  },

  getToolsByUserId(knex, user_id) {
    return knex
      .from('tools')
      .select('*')
      .where('user_id', user_id)
  },

  getById(knex, id) {
    return knex
      .from("tools")
      .select("*")
      .where("id", id)
      .first();
  },

  deleteTool(knex, id) {
    return knex("tools")
      .where({ id })
      .delete();
  },

  updateTool(knex, id, newToolFields) {
    return knex('tools')
      .where({ id })
      .update(newToolFields)
  },
}

module.exports = ToolsService;