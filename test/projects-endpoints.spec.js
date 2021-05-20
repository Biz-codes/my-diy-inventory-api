const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeProjectsArray } = require('./projects.fixtures')

describe('Projects Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })
      
    after('disconnect from db', () => db.destroy())    

    before('clean the table', () => db.raw('TRUNCATE users, projects RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE users, projects RESTART IDENTITY CASCADE'))

    describe(`GET /api/projects`, () => {

        context(`Given no projects`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/projects')
                .expect(200, [])
            })
        })

        context('Given there are projects in the database', () => {
            const testUsers = makeUsersArray();
            const testProjects = makeProjectsArray()
      
            beforeEach('insert projects', () => {
              return db
              .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('projects')
                    .insert(testProjects)
                })
                
            })
      
            it('responds with 200 and all of the projects', () => {
              return supertest(app)
                .get('/api/projects')
                .expect(200, testProjects)
            })
        })
    })

    describe(`POST /api/projects`, () => {

        const testUsers = makeUsersArray();
  
        beforeEach('post projects', () => {
          return db
            .into('users')
            .insert(testUsers)
        })

        it(`creates a project, responding with 201 and the new project`, function() {
            
            const newProject = {
                user_id: 1,
                project_name: 'Test project',
                supplies_needed: 'stuff',
                tools_needed: 'things',
                instructions: 'steps',
                delivery_date: '2019-07-04T00:00:00.000Z',
                done: false
            }
            return supertest(app)
                .post('/api/projects')
                .send(newProject)
                .expect(201) 
                .expect(res => {
                    expect(res.body.project_name).to.eql(newProject.project_name)
                    expect(res.body.user_id).to.eql(newProject.user_id)
                    expect(res.body.supplies_needed).to.eql(newProject.supplies_needed)
                    expect(res.body.tools_needed).to.eql(newProject.tools_needed)
                    expect(res.body.instructions).to.eql(newProject.instructions)
                    expect(res.body.delivery_date).to.eql(newProject.delivery_date)
                    expect(res.body.done).to.eql(newProject.done)
                    expect(res.body).to.have.property('id')
                    expect(res.headers.location).to.eql(`/api/projects/${res.body.id}`)
                })
            .then(res =>
                supertest(app)
                .get(`/api/projects/${res.body.id}`)
                .expect(res.body)
            )
        })
    
  
      const requiredFields = ['user_id', 'project_name', 'supplies_needed', 'tools_needed', 'instructions', 'delivery_date', 'done']
  
      requiredFields.forEach(field => {
        const newProject = {
            user_id: 1,
            project_name: 'Test project',
            supplies_needed: 'stuff',
            tools_needed: 'things',
            instructions: 'steps',
            delivery_date: '2019-07-04T00:00:00.000Z',
            done: false
        }
      
    
        it(`responds with 400 and an error message when the '${field}' is missing`, () => {
          delete newProject[field]
    
          return supertest(app)
            .post('/api/projects')
            .send(newProject)
            .expect(400, {
              error: { message: `Missing '${field}' in request body` }
            })
        })
    })
})

    describe(`DELETE /api/projects/:project_id`, () => {
        context(`Given no supplies`, () => {
          it(`responds with 404`, () => {
            const projectId = 123456
            return supertest(app)
              .delete(`/api/projects/${projectId}`)
              .expect(404, { error: { message: `Project doesn't exist` } })
          })
         })
    
    
         context('Given there are projects in the database', () => {
            const testUsers = makeUsersArray();
            const testProjects = makeProjectsArray()
      
            beforeEach('insert projects', () => {
              return db
              .into('users')
                .insert(testUsers)
                .then(() => {
                  return db
                    .into('projects')
                    .insert(testProjects)
                })
                
            })
    
          it('responds with 204 and removes the project', () => {
            const idToRemove = 2
            const expectedProject = testProjects.filter(project => project.id !== idToRemove)
            return supertest(app)
              .delete(`/api/projects/${idToRemove}`)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/projects`)
                  .expect(expectedProject)
              )
          })
        })
      })

    //   describe(`PATCH /api/supplies/:supply_id`, () => {
    //     context(`Given no supplies`, () => {
    //       it(`responds with 404`, () => {
    //         const supplyId = 123456
    //         return supertest(app)
    //           .patch(`/api/supplies/${supplyId}`)
    //           .expect(404, { error: { message: `Supply doesn't exist` } })
    //       })
    //     })
    
    //     context('Given there are supplies in the database', () => {
    //       const testUsers = makeUsersArray();
    //           const testSupplies = makeSuppliesArray()
        
    //           beforeEach('insert supplies', () => {
    //             return db
    //             .into('users')
    //               .insert(testUsers)
    //               .then(() => {
    //                 return db
    //                   .into('supplies')
    //                   .insert(testSupplies)
    //               })
                  
    //           })
          
    //       it('responds with 204 and updates the supply', () => {
    //         const idToUpdate = 2
    //         const updatedSupply = {
    //           supply_name: 'Updated supply',
    //           user_id: 1,
    //           details: 'Updated description',
    //           quantity: 1
    //         }
    //         const expectedSupply = {
    //           ...testSupplies[idToUpdate - 1],
    //           ...updatedSupply
    //         }
    //         return supertest(app)
    //           .patch(`/api/supplies/${idToUpdate}`)
    //           .send(updatedSupply)
    //           .expect(204)
    //           .then(res =>
    //             supertest(app)
    //               .get(`/api/supplies/${idToUpdate}`)
    //               .expect(expectedSupply)
    //           )
    //       })
    
    //       it(`responds with 400 when no required fields supplied`, () => {
    //         const idToUpdate = 2
    //         return supertest(app)
    //           .patch(`/api/supplies/${idToUpdate}`)
    //           .send({ irrelevantField: 'foo' })
    //           .expect(400, {
    //             error: {
    //               message: `Request body must contain either 'supply_name', 'details', or 'quantity'.`
    //             }
    //           })
    //       })
          
    //       it(`responds with 204 when updating only a subset of fields`, () => {
    //         const idToUpdate = 2
    //         const updatedSupply = {
    //           supply_name: 'Updated supply',
    //         }
    //         const expectedSupply = {
    //           ...testSupplies[idToUpdate - 1],
    //           ...updatedSupply
    //         }
            
    //         return supertest(app)
    //           .patch(`/api/supplies/${idToUpdate}`)
    //           .send({
    //             ...updatedSupply,
    //             fieldToIgnore: 'should not be in GET response'
    //           })
    //           .expect(204)
    //             .then(res =>
    //               supertest(app)
    //                 .get(`/api/supplies/${idToUpdate}`)
    //                 .expect(expectedSupply)
    //             )
    //       })
          
    //     })
    //   })
})