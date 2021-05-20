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

    before('clean the table', () => db.raw('TRUNCATE users, tools RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE users, tools RESTART IDENTITY CASCADE'))

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

    describe(`POST /api/tools`, () => {

      const testUsers = makeUsersArray();

      beforeEach('post tools', () => {
        return db
          .into('users')
          .insert(testUsers)
      })

      it(`creates a tool, responding with 201 and the new tool`, function() {
          
          const newTool = {
              tool_name: 'Test tool',
              user_id: 1,
              details: 'Test description',
              quantity: 1
          }
          return supertest(app)
              .post('/api/tools')
              .send(newTool)
              .expect(201) 
              .expect(res => {
                  expect(res.body.tool_name).to.eql(newTool.tool_name)
                  expect(res.body.user_id).to.eql(newTool.user_id)
                  expect(res.body.details).to.eql(newTool.details)
                  expect(res.body.quantity).to.eql(newTool.quantity)
                  expect(res.body).to.have.property('id')
                  expect(res.headers.location).to.eql(`/api/tools/${res.body.id}`)
              })
          .then(res =>
              supertest(app)
              .get(`/api/tools/${res.body.id}`)
              .expect(res.body)
          )
      })
  

      const requiredFields = ['tool_name', 'user_id', 'details', 'quantity']

      requiredFields.forEach(field => {
        const newTool = {
            tool_name: 'Test tool',
            user_id: 1,
            details: 'Test description',
            quantity: 1
        }
    
  
      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newTool[field]
  
        return supertest(app)
          .post('/api/tools')
          .send(newTool)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` }
          })
      })
  })

})
})
