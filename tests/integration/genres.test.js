const request = require("supertest");
const { Genre } = require("../../models/genre");
const { User } = require("../../models/user");

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

  describe("GET /:id", () => {
    it("should return genre if valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();

      const res = await request(server).get(`/api/genres/${genre._id}`);

      expect(res.status).toBe(200); // too generic
      expect(res.body).toMatchObject({ name: "genre1" });
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("should return 404 if invalid id is passed", async () => {
      const res = await request(server).get("/api/genres/1");

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // assume user is not logged in
    it("should return 401 if client is not logged in", async () => {
      const res = await request(server)
        .post("/api/genres")
        .send({ name: "genre1" });

      expect(res.status).toBe(401);
    });

    // assume user is logged in but sends invalid genre
    it("should return 400 if genre is less than 5 characters", async () => {
      // First login (generate auth token)
      const token = new User().generateAuthToken();

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: "1234" });

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      // First login (generate auth token)
      const token = new User().generateAuthToken();

      const name = new Array(52).join("a"); // generate a string of 51 characters

      const res = await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name: name });

      expect(res.status).toBe(400);
    });
  });
});
