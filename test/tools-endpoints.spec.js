const { expect } = require("chai");
const knex = require("knex");
const app = require("../src/app");
const { makeUsersArray } = require("./users.fixtures");
const { makeToolsArray, makeMaliciousTool } = require("./tools.fixtures");

describe("Tools Endpoints", function () {
  let db;

  before("make knex instance", () => {
    db = knex({
      client: "pg",
      connection: process.env.TEST_DATABASE_URL,
    });
    app.set("db", db);
  });

  after("disconnect from db", () => db.destroy());

  before("clean the table", () =>
    db.raw("TRUNCATE users, tools RESTART IDENTITY CASCADE")
  );

  afterEach("cleanup", () =>
    db.raw("TRUNCATE users, tools RESTART IDENTITY CASCADE")
  );

  describe(`GET /api/tools`, () => {
    context(`Given no tools`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app).get("/api/supplies").expect(200, []);
      });
    });

    context("Given there are tools in the database", () => {
      const testUsers = makeUsersArray();
      const testTools = makeToolsArray();

      beforeEach("insert tools", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("tools").insert(testTools);
          });
      });

      it("responds with 200 and all of the tools", () => {
        return supertest(app).get("/api/tools").expect(200, testTools);
      });
    });

    context(`Given an XSS attack tool`, () => {
      const testUsers = makeUsersArray();
      const { maliciousTool, expectedTool } = makeMaliciousTool();

      beforeEach("insert malicious tool", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("tools").insert([maliciousTool]);
          });
      });

      it("removes XSS attack content", () => {
        return supertest(app)
          .get(`/api/tools`)
          .expect(200)
          .expect((res) => {
            expect(res.body[0].user_id).to.eql(expectedTool.user_id);
            expect(res.body[0].tool_name).to.eql(expectedTool.tool_name);
            expect(res.body[0].details).to.eql(expectedTool.details);
            expect(res.body[0].quantity).to.eql(expectedTool.quantity);
          });
      });
    });

  });

  describe(`POST /api/tools`, () => {
    const testUsers = makeUsersArray();

    beforeEach("post tools", () => {
      return db.into("users").insert(testUsers);
    });

    it(`creates a tool, responding with 201 and the new tool`, function () {
      const newTool = {
        tool_name: "Test tool",
        user_id: 1,
        details: "Test description",
        quantity: 1,
      };
      return supertest(app)
        .post("/api/tools")
        .send(newTool)
        .expect(201)
        .expect((res) => {
          expect(res.body.tool_name).to.eql(newTool.tool_name);
          expect(res.body.user_id).to.eql(newTool.user_id);
          expect(res.body.details).to.eql(newTool.details);
          expect(res.body.quantity).to.eql(newTool.quantity);
          expect(res.body).to.have.property("id");
          expect(res.headers.location).to.eql(`/api/tools/${res.body.id}`);
        })
        .then((res) =>
          supertest(app).get(`/api/tools/${res.body.id}`).expect(res.body)
        );
    });

    const requiredFields = ["tool_name", "user_id", "details", "quantity"];

    requiredFields.forEach((field) => {
      const newTool = {
        tool_name: "Test tool",
        user_id: 1,
        details: "Test description",
        quantity: 1,
      };

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newTool[field];

        return supertest(app)
          .post("/api/tools")
          .send(newTool)
          .expect(400, {
            error: { message: `Missing '${field}' in request body` },
          });
      });
    });

    it("removes XSS attack content", () => {
      const { maliciousTool, expectedTool } = makeMaliciousTool();
      return supertest(app)
        .post(`/api/tools`)
        .send(maliciousTool)
        .expect(201)
        .expect((res) => {
          expect(res.body.user_id).to.eql(expectedTool.user_id);
          expect(res.body.tool_name).to.eql(expectedTool.tool_name);
          expect(res.body.details).to.eql(expectedTool.details);
          expect(res.body.quantity).to.eql(expectedTool.quantity);
        });
    });

  });

  describe(`DELETE /api/tools/:tool_id`, () => {
    context(`Given no tools`, () => {
      it(`responds with 404`, () => {
        const toolId = 123456;
        return supertest(app)
          .delete(`/api/tools/${toolId}`)
          .expect(404, { error: { message: `Tool doesn't exist` } });
      });
    });

    context("Given there are tools in the database", () => {
      const testUsers = makeUsersArray();
      const testTools = makeToolsArray();

      beforeEach("insert tools", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("tools").insert(testTools);
          });
      });

      it("responds with 204 and removes the tool", () => {
        const idToRemove = 2;
        const expectedTool = testTools.filter(
          (tool) => tool.id !== idToRemove
        );
        return supertest(app)
          .delete(`/api/tools/${idToRemove}`)
          .expect(204)
          .then((res) =>
            supertest(app).get(`/api/tools`).expect(expectedTool)
          );
      });
    });
  });

  describe(`PATCH /api/tools/:tool_id`, () => {
    context(`Given no tools`, () => {
      it(`responds with 404`, () => {
        const toolId = 123456
        return supertest(app)
          .patch(`/api/tools/${toolId}`)
          .expect(404, { error: { message: `Tool doesn't exist` } })
      })
    })

    context("Given there are tools in the database", () => {
      const testUsers = makeUsersArray();
      const testTools = makeToolsArray();

      beforeEach("insert tools", () => {
        return db
          .into("users")
          .insert(testUsers)
          .then(() => {
            return db.into("tools").insert(testTools);
          });
      });
      
      it('responds with 204 and updates the tool', () => {
        const idToUpdate = 2
        const updatedTool = {
          tool_name: 'Updated tool',
          user_id: 1,
          details: 'Updated description',
          quantity: 1
        }
        const expectedTool = {
          ...testTools[idToUpdate - 1],
          ...updatedTool
        }
        return supertest(app)
          .patch(`/api/tools/${idToUpdate}`)
          .send(updatedTool)
          .expect(204)
          .then(res =>
            supertest(app)
              .get(`/api/tools/${idToUpdate}`)
              .expect(expectedTool)
          )
      })

      it(`responds with 400 when no required fields supplied`, () => {
        const idToUpdate = 2
        return supertest(app)
          .patch(`/api/tools/${idToUpdate}`)
          .send({ irrelevantField: 'foo' })
          .expect(400, {
            error: {
              message: `Request body must contain either 'tool_name', 'details', or 'quantity'.`
            }
          })
      })
      
      it(`responds with 204 when updating only a subset of fields`, () => {
        const idToUpdate = 2
        const updatedTool = {
          tool_name: 'Updated tool',
        }
        const expectedTool = {
          ...testTools[idToUpdate - 1],
          ...updatedTool
        }
        
        return supertest(app)
          .patch(`/api/tools/${idToUpdate}`)
          .send({
            ...updatedTool,
            fieldToIgnore: 'should not be in GET response'
          })
          .expect(204)
            .then(res =>
              supertest(app)
                .get(`/api/tools/${idToUpdate}`)
                .expect(expectedTool)
            )
      })
      
    })
  })
});
