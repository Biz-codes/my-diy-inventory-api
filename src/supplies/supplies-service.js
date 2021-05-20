const SuppliesService = {
    getAllSupplies(knex) {
      return knex.select('*').from('supplies')
    },
  
    insertSupply(knex, newSupply) {
      return knex
        .insert(newSupply)
        .into('supplies')
        .returning('*')
        .then(rows => {
          return rows[0]
        })
    },

    // getById(knex, id) {
    //   return knex
    //     .from('noteful_notes')
    //     .select('*')
    //     .where('id', id)
    //     .first()
    // },
  
    // deleteNote(knex, id) {
    //   return knex('noteful_notes')
    //     .where({ id })
    //     .delete()
    // },
  
    // updateNote(knex, id, newNoteFields) {
    //   return knex('noteful_notes')
    //     .where({ id })
    //     .update(newNoteFields)
    // },
  }
  
  module.exports = SuppliesService