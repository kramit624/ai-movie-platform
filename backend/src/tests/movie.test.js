const request = require("supertest");
const app = require("../app");

describe("Movie API", () => {
  test("health check should return API working", async () => {
    const res = await request(app).get("/api/v1/health");

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("API working");
  });
});
