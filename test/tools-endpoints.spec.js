const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeToolsArray } = require('./tools.fixtures')

describe('Tools Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
      
    after('disconnect from db', () => db.destroy())    

    before('clean the table', () => db.raw('TRUNCATE users, supplies RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE users, supplies RESTART IDENTITY CASCADE'))

    describe(`GET /api/tools`, () => {

        context(`Given no tools`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/supplies')
                .expect(200, [])
            })
        })

        context('Given there are tools in the database', () => {
            const testUsers = makeUsersArray();
            const testTools = makeToolsArray()
      
            beforeEach('insert tools', () => {
              return db
              .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('tools')
                    .insert(testTools)
                })
                
            })
      
            it('responds with 200 and all of the tools', () => {
              return supertest(app)
                .get('/api/tools')
                .expect(200, testTools)
            })
        })
    })
})
