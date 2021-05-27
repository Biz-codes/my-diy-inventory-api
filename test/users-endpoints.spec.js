const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray, makeMaliciousUser} = require('./users.fixtures')

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
    before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    // afterEach('cleanup',() => db('users').truncate())
    afterEach('cleanup',() => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    describe(`GET /api/users`, () => {

        context('Given there are users in the database', () => {
            const testUsers = makeUsersArray();
      
            beforeEach('insert users', () => {
              return db
              .into('users')
                .insert(testUsers)    
            })
      
            it('responds with 200 and all of the users', function () {
              return supertest(app)
                .get('/api/users')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`) 
                .expect(200)
                .expect(res => {
                    expect(res.body.id).to.eql(testUsers.id)
                    expect(res.body.name).to.eql(testUsers.name)
                    expect(res.body.username).to.eql(testUsers.username)
                })
            });

        });

    //     context('Given an XSS attack user', () => {
    //       const { maliciousUser, expectedUser} = makeMaliciousUser();

    //       beforeEach('insert malicious user into db', () => {
    //           return db  
    //               .into('users')
    //               .insert(maliciousUser)
    //       });
              
    //       it(`removes XSS attack content`, () => {
    //           return supertest(app)
    //               .get(`/api/users/${maliciousUser.id}`)
    //               .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
    //               .expect(200)
    //               .expect(res => {
    //                   expect(res.body.name).to.eql(expectedUser.name)
    //                   expect(res.body.username).to.eql(expectedUser.username)
    //                 //   expect(res.body.password).to.eql(expectedUser.password)
                      
    //               })
    //       });
      
    // });
 
  });

  describe(`POST /api/users`, () => {

      it(`creates a user, responding with 201`, function () {
          const newUser = {
              name: 'Test name',
              username: 'Test new user', 
              password: 'aaAA11!!',

          };
          return supertest(app)
              .post(`/api/users/`)
              .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
              .send(newUser)
              .expect(201)
      });


    });

})