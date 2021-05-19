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

    before('clean the table', () => db('my-diy-inventory_users').truncate())
    // before('clean the table', () => db.raw('TRUNCATE my-diy-inventory_users, supplies RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db('my-diy-inventory_users').truncate())
    // afterEach('cleanup',() => db.raw('TRUNCATE my-diy-inventory_users, supplies RESTART IDENTITY CASCADE'))

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
              .into('my-diy-database_users')
                .insert(testUsers)    
            })
      
            it('responds with 200 and all of the users', () => {
              return supertest(app)
                .get('/api/users')
                .expect(200, testUsers)
            })
        })
    })

    // describe(`GET /api/folders/:folder_id`, () => {

    //     context(`Given no folders`, () => {
    //       it(`responds with 404`, () => {
    //         const folderId = 123456
    //         return supertest(app)
    //           .get(`/api/folders/${folderId}`)
    //           .expect(404, { error: { message: `Folder doesn't exist` } })
    //       })
    //     })
    
    //     context('Given there are folders in the database', () => {
    //       const testFolders = makeFoldersArray();
    
    //       beforeEach('insert folders', () => {
    //         return db
    //           .into('noteful_folders')
    //           .insert(testFolders)
    //       })
    
    //       it('responds with 200 and the specified folder', () => {
    //         const folderId = 2
    //         const expectedFolder = testFolders[folderId - 1]
    //         return supertest(app)
    //           .get(`/api/folders/${folderId}`)
    //           .expect(200, expectedFolder)
    //       })
    //     })
    // })

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

    // describe(`DELETE /api/folders/:folder_id`, () => {
    //     context(`Given no folders`, () => {
    //       it(`responds with 404`, () => {
    //         const folderId = 123456
    //         return supertest(app)
    //           .delete(`/api/folders/${folderId}`)
    //           .expect(404, { error: { message: `Folder doesn't exist` } })
    //       })
    //      })
    
    
    //     context('Given there are folders in the database', () => {
    //       const testFolders = makeFoldersArray();
    
    //       beforeEach('insert folders', () => {
    //         return db
    //           .into('noteful_folders')
    //           .insert(testFolders)
    //       })
    
    //       it('responds with 204 and removes the folder', () => {
    //         const idToRemove = 2
    //         const expectedFolder = testFolders.filter(folder => folder.id !== idToRemove)
    //         return supertest(app)
    //           .delete(`/api/folders/${idToRemove}`)
    //           .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/folders`)
    //               .expect(expectedFolder)
    //           )
    //       })
    //     })
    // })

    // describe(`PATCH /api/folders/:folder_id`, () => {
    //     context(`Given no folders`, () => {
    //       it(`responds with 404`, () => {
    //         const folderId = 123456
    //         return supertest(app)
    //           .patch(`/api/folders/${folderId}`)
    //           .expect(404, { error: { message: `Folder doesn't exist` } })
    //       })
    //     })
    
    //     context('Given there are folders in the database', () => {
    //       const testFolders = makeFoldersArray();
          
    //       beforeEach('insert folders', () => {
    //         return db
    //           .into('noteful_folders')
    //           .insert(testFolders)
    //       })
          
    //       it('responds with 204 and updates the folder', () => {
    //         const idToUpdate = 2
    //         const updateFolder = {
    //           folder_name: 'Updated folder',
    //         }
    //         const expectedFolder = {
    //           ...testFolders[idToUpdate - 1],
    //           ...updateFolder
    //         }
    //         return supertest(app)
    //           .patch(`/api/folders/${idToUpdate}`)
    //           .send(updateFolder)
    //           .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/folders/${idToUpdate}`)
    //               .expect(expectedFolder)
    //           )
    //       })
    
    //       it(`responds with 400 when no required fields supplied`, () => {
    //         const idToUpdate = 2
    //         return supertest(app)
    //           .patch(`/api/folders/${idToUpdate}`)
    //           .send({})
    //           .expect(400, {
    //             error: {
    //               message: `Request body must contain 'folder_name'`
    //             }
    //           })
    //       })
    //     })
    // })

})