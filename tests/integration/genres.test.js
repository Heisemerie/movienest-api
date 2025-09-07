const request = require("supertest");
const { Genre } = require("../../models/genre");

let server;

describe("/api/genres", () => {
  // Initialize and close the server after testing to prevent creating multiple servers clashing on the same port
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.deleteMany({}); // cleanup after modifying the state to make test repeatable
  });

  describe("GET", () => {
    it("should return all genres", async () => {
      // Populate the Test DB
      await Genre.collection.insertMany([
        { name: "genre1" },
        { name: "genre2" },
      ]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200); // too generic
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
});
