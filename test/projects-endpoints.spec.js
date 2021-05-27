const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./users.fixtures')
const { makeProjectsArray, makeMaliciousProject } = require('./projects.fixtures')

describe.only('Projects Endpoints', function() {
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

        context(`Given an XSS attack project`, () => {
          const testUsers = makeUsersArray();
          const { maliciousProject, expectedProject } = makeMaliciousProject();
    
          beforeEach("insert malicious project", () => {
            return db
              .into("users")
              .insert(testUsers)
              .then(() => {
                return db.into("projects").insert([maliciousProject]);
              });
          });
    
          it("removes XSS attack content", () => {
            return supertest(app)
              .get(`/api/projects`)
              .expect(200)
              .expect((res) => {
                expect(res.body[0].user_id).to.eql(expectedProject.user_id);
                expect(res.body[0].project_name).to.eql(expectedProject.project_name);
                expect(res.body[0].supplies_needed).to.eql(expectedProject.supplies_needed);
                expect(res.body[0].tools_needed).to.eql(expectedProject.tools_needed);
                expect(res.body[0].instructions).to.eql(expectedProject.instructions);
                expect(res.body[0].delivery_date).to.eql(expectedProject.delivery_date);
                expect(res.body[0].done).to.eql(expectedProject.done);
              });
          });
        });
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
                done: "to-do it myself"
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
            done: "to-do it myself"
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

    it("removes XSS attack content", () => {
      const { maliciousProject, expectedProject } = makeMaliciousProject();
      return supertest(app)
        .post(`/api/projects`)
        .send(maliciousProject)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_id).to.eql(expectedProject.user_id);
          expect(res.body.project_name).to.eql(expectedProject.project_name);
          expect(res.body.supplies_needed).to.eql(expectedProject.supplies_needed);
          expect(res.body.tools_needed).to.eql(expectedProject.tools_needed);
          expect(res.body.instructions).to.eql(expectedProject.instructions);
          expect(res.body.delivery_date).to.eql(expectedProject.delivery_date);
          expect(res.body.done).to.eql(expectedProject.done);
        });
    });
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

      describe(`PATCH /api/projects/:project_id`, () => {
        context(`Given no projects`, () => {
          it(`responds with 404`, () => {
            const projectId = 123456
            return supertest(app)
              .patch(`/api/projects/${projectId}`)
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
          
          it('responds with 204 and updates the project', () => {
            const idToUpdate = 2
            const updatedProject = {
              user_id: 1,
              project_name: 'Updated project',
              supplies_needed: 'stuff',
              tools_needed: 'things',
              instructions: 'steps',
              delivery_date: '2019-07-04T00:00:00.000Z',
              done: "to-do it myself"
            }
            const expectedProject = {
              ...testProjects[idToUpdate - 1],
              ...updatedProject
            }
            return supertest(app)
              .patch(`/api/projects/${idToUpdate}`)
              .send(updatedProject)
              .expect(204)
              .then(res =>
                supertest(app)
                  .get(`/api/projects/${idToUpdate}`)
                  .expect(expectedProject)
              )
          })
    
          it(`responds with 400 when no required fields supplied`, () => {
            const idToUpdate = 2
            return supertest(app)
              .patch(`/api/projects/${idToUpdate}`)
              .send({ irrelevantField: 'foo' })
              .expect(400, {
                error: {
                  message: `Request body must contain either 'project_name', 'supplies_needed', 'tools_needed', 'instructions', 'delivery_date', or 'done'.`
                }
              })
          })
          
          it(`responds with 204 when updating only a subset of fields`, () => {
            const idToUpdate = 2
            const updatedProject = {
              project_name: 'Updated project',
            }
            const expectedProject = {
              ...testProjects[idToUpdate - 1],
              ...updatedProject
            }
            
            return supertest(app)
              .patch(`/api/projects/${idToUpdate}`)
              .send({
                ...updatedProject,
                fieldToIgnore: 'should not be in GET response'
              })
              .expect(204)
                .then(res =>
                  supertest(app)
                    .get(`/api/projects/${idToUpdate}`)
                    .expect(expectedProject)
                )
          })
          
        })
      })
})