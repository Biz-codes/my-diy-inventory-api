const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeSuppliesArray } = require('./supplies.fixtures')

describe('Supplies Endpoints', function() {
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

    describe(`GET /api/supplies`, () => {

        context(`Given no supplies`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/supplies')
                .expect(200, [])
            })
        })

        context('Given there are supplies in the database', () => {
            const testUsers = makeUsersArray();
            const testSupplies = makeSuppliesArray()
      
            beforeEach('insert supplies', () => {
              return db
              .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('supplies')
                    .insert(testSupplies)
                })
                
            })
      
            it('responds with 200 and all of the supplies', () => {
              return supertest(app)
                .get('/api/supplies')
                .expect(200, testSupplies)
            })
        })

        // context(`Given an XSS attack note`, () => {
        //     const { maliciousNote, expectedNote } = makeMaliciousNote()
        
        //     beforeEach('insert malicious note', () => {
        //       return db
        //         .into('noteful_notes')
        //         .insert([ maliciousNote ])
        //     })
        
        //     it('removes XSS attack content', () => {
        //       return supertest(app)
        //         .get(`/api/notes`)
        //         .expect(200)
        //         .expect(res => {
        //           expect(res.body[0].note_name).to.eql(expectedNote.note_name)
        //           expect(res.body[0].content).to.eql(expectedNote.content)
        //         })
        //     })
        // })
    })


    describe(`POST /api/supplies`, () => {

        const testUsers = makeUsersArray();
  
        beforeEach('post supplies', () => {
          return db
            .into('users')
            .insert(testUsers)
        })

        it(`creates a supply, responding with 201 and the new supply`, function() {
            
            const newSupply = {
                supply_name: 'Test supply',
                user_id: 1,
                details: 'Test description',
                quantity: 1
            }
            return supertest(app)
                .post('/api/supplies')
                .send(newSupply)
                .expect(201) 
                .expect(res => {
                    expect(res.body.supply_name).to.eql(newSupply.supply_name)
                    expect(res.body.user_id).to.eql(newSupply.user_id)
                    expect(res.body.details).to.eql(newSupply.details)
                    expect(res.body.quantity).to.eql(newSupply.quantity)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/supplies/${res.body.id}`)
                })
            .then(res =>
                supertest(app)
                .get(`/api/supplies/${res.body.id}`)
                .expect(res.body)
            )
        })
    
  
      const requiredFields = ['supply_name', 'user_id', 'details', 'quantity']
  
      requiredFields.forEach(field => {
        const newSupply = {
            supply_name: 'Test supply',
            user_id: 1,
            details: 'Test description',
            quantity: 1
        }
      
    
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newSupply[field]
    
          return supertest(app)
            .post('/api/supplies')
            .send(newSupply)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
    })
})
    //   // it('removes XSS attack content from response', () => {
    //   //   const { maliciousArticle, expectedArticle } = makeMaliciousArticle()
    //   //   return supertest(app)
    //   //     .post(`/api/articles`)
    //   //     .send(maliciousArticle)
    //   //     .expect(201)
    //   //     .expect(res => {
    //   //       expect(res.body.title).to.eql(expectedArticle.title)
    //   //       expect(res.body.content).to.eql(expectedArticle.content)
    //   //     })
    //   // })
    // })

    // describe(`DELETE /api/notes/:note_id`, () => {
    //   context(`Given no notes`, () => {
    //     it(`responds with 404`, () => {
    //       const noteId = 123456
    //       return supertest(app)
    //         .delete(`/api/notes/${noteId}`)
    //         .expect(404, { error: { message: `Note doesn't exist` } })
    //     })
    //    })
  
  
    //   context('Given there are notes in the database', () => {
    //     const testFolders = makeFoldersArray();
    //     const testNotes = makeNotesArray()
  
    //     beforeEach('insert notes', () => {
    //       return db
    //         .into('noteful_folders')
    //         .insert(testFolders)
    //         .then(() => {
    //           return db
    //             .into('noteful_notes')
    //             .insert(testNotes)
    //         })
    //     })
  
    //     it('responds with 204 and removes the note', () => {
    //       const idToRemove = 2
    //       const expectedNote = testNotes.filter(note => note.id !== idToRemove)
    //       return supertest(app)
    //         .delete(`/api/notes/${idToRemove}`)
    //         .expect(204)
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/notes`)
    //             .expect(expectedNote)
    //         )
    //     })
    //   })
    // })
  
    // describe(`PATCH /api/notes/:note_id`, () => {
    //   context(`Given no notes`, () => {
    //     it(`responds with 404`, () => {
    //       const noteId = 123456
    //       return supertest(app)
    //         .patch(`/api/notes/${noteId}`)
    //         .expect(404, { error: { message: `Note doesn't exist` } })
    //     })
    //   })
  
    //   context('Given there are notes in the database', () => {
    //     const testFolders = makeFoldersArray();
    //     const testNotes = makeNotesArray()
        
    //     beforeEach('insert notes', () => {
    //       return db
    //         .into('noteful_folders')
    //         .insert(testFolders)
    //         .then(() => {
    //           return db
    //             .into('noteful_notes')
    //             .insert(testNotes)
    //         })
    //     })
        
    //     it('responds with 204 and updates the note', () => {
    //       const idToUpdate = 2
    //       const updateNote = {
    //         note_name: 'Updated note',
    //         content: 'Bluebirds fly',
    //         folder_id: 2
    //       }
    //       const expectedNote = {
    //         ...testNotes[idToUpdate - 1],
    //         ...updateNote
    //       }
    //       return supertest(app)
    //         .patch(`/api/notes/${idToUpdate}`)
    //         .send(updateNote)
    //         .expect(204)
    //         .then(res =>
    //           supertest(app)
    //             .get(`/api/notes/${idToUpdate}`)
    //             .expect(expectedNote)
    //         )
    //     })
  
    //     it(`responds with 400 when no required fields supplied`, () => {
    //       const idToUpdate = 2
    //       return supertest(app)
    //         .patch(`/api/notes/${idToUpdate}`)
    //         .send({ irrelevantField: 'foo' })
    //         .expect(400, {
    //           error: {
    //             message: `Request body must contain either 'note_name', 'content' or 'folder_id'`
    //           }
    //         })
    //     })
        
    //     it(`responds with 204 when updating only a subset of fields`, () => {
    //       const idToUpdate = 2
    //       const updatedNote = {
    //         note_name: 'updated note',
    //       }
    //       const expectedNote = {
    //         ...testNotes[idToUpdate - 1],
    //         ...updatedNote
    //       }
          
    //       return supertest(app)
    //         .patch(`/api/notes/${idToUpdate}`)
    //         .send({
    //           ...updatedNote,
    //           fieldToIgnore: 'should not be in GET response'
    //         })
    //         .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/notes/${idToUpdate}`)
    //               .expect(expectedNote)
    //           )
    //     })
        
    //   })
    // })
  


})