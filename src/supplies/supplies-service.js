const SuppliesService = {
    getAllSupplies(knex) {
      return knex.select('*')
        .from('supplies')
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

    getSuppliesByUserId(knex, user_id) {
      return knex
        .from('supplies')
        .select('*')
        .where('user_id', user_id)
    },

    getById(knex, id) {
      return knex
        .from('supplies')
        .select('*')
        .where('id', id)
        .first()
    },
  
    deleteSupply(knex, id) {
      return knex('supplies')
        .where({ id })
        .delete()
    },
  
    updateSupply(knex, id, newSupplyFields) {
      return knex('supplies')
        .where({ id })
        .update(newSupplyFields)
    },
  }
  
  module.exports = SuppliesService