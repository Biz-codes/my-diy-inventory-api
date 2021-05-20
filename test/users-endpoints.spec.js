const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')

describe('Users Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
      
    after('disconnect from db', () => db.destroy())    

    // before('clean the table', () => db('users').truncate())
    before('clean the table', () => db.raw('TRUNCATE users, supplies RESTART IDENTITY CASCADE'))

    // afterEach('cleanup',() => db('users').truncate())
    afterEach('cleanup',() => db.raw('TRUNCATE users, supplies RESTART IDENTITY CASCADE'))

    describe(`GET /api/users`, () => {

        context(`Given no users`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/users')
                .expect(200, [])
            })
        })

        context('Given there are users in the database', () => {
            const testUsers = makeUsersArray();
      
            beforeEach('insert users', () => {
              return db
              .into('users')
                .insert(testUsers)    
            })
      
            it('responds with 200 and all of the users', () => {
              return supertest(app)
                .get('/api/users')
                .expect(200, testUsers)
            })
        })
    })

    

    // describe(`POST /api/folders`, () => {
  
    //     it(`creates a folder, responding with 201 and the new folder`, function() {
    //       const newFolder = {
    //           folder_name: 'Test folder',
    //       }
    //       return supertest(app)
    //         .post('/api/folders')
    //         .send(newFolder)
    //         .expect(201) 
    //         .expect(res => {
    //           expect(res.body.folder_name).to.eql(newFolder.folder_name)
    //           expect(res.body).to.have.property('id')
    //           expect(res.headers.location).to.eql(`/api/folders/${res.body.id}`)
    //         })
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/folders/${res.body.id}`)
    //             .expect(res.body)
    //         )
    //     })
    
    //     const requiredFields = ['folder_name']
    
    //     requiredFields.forEach(field => {
    //       const newFolder = {
    //         folder_name: 'Test folder',
    //       }
      
    //       it(`responds with 400 and an error message when the '${field}' is missing`, () => {
    //         delete newFolder[field]
      
    //         return supertest(app)
    //           .post('/api/folders')
    //           .send(newFolder)
    //           .expect(400, {
    //             error: { message: `Missing '${field}' in request body` }
    //           })
    //       })
    //     })
    // })

    

})