const request = require("supertest");
const { Genre } = require("../../../models/genre");
const { User } = require("../../../models/user");
const { default: mongoose } = require("mongoose");

let server;

describe("/api/genres", () => {
  // Initialize and close the server after testing to prevent creating multiple servers clashing on the same port
  beforeEach(() => {
    server = require("../../../index");
  });
  afterEach(async () => {
    await Genre.deleteMany({}); // cleanup after modifying the state to make test repeatable
    await server.close();
  });

  describe("GET", () => {
    it("should return all genres", async () => {
      // Populate the Test DB
      await Genre.insertMany([{ name: "genre1" }, { name: "genre2" }]);

      const res = await request(server).get("/api/genres");

      expect(res.status).toBe(200); // too generic
      expect(res.body.length).toBe(2);
      expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    let id;

    const exec = async () => {
      return await request(server).get(`/api/genres/${id}`);
    };

    beforeEach(async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      id = genre._id;
    });

    it("should return genre if valid id is passed", async () => {
      const res = await exec();

      expect(res.status).toBe(200); // too generic
      expect(res.body).toMatchObject({ name: "genre1" });
      expect(res.body).toHaveProperty("name", "genre1");
    });

    it("should return 404 if invalid id is passed", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 404 if no genre with the given ID exists", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });
  });

  describe("POST /", () => {
    // Define the happy path (in beforeEach)
    // In each test, we change one parameter that clearly aligns with the name of the test
    let token;
    let name;

    const exec = async () => {
      return await request(server)
        .post("/api/genres")
        .set("x-auth-token", token)
        .send({ name }); // send the genre
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    // Testing the failure paths (Authorization & Invalid inputs)
    // assume user is not logged in
    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    // assume user is logged in but sends invalid genre
    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a"); // generate a string of 51 characters

      const res = await exec();

      expect(res.status).toBe(400);
    });

    // Testing the Happy Paths (Save to DB and API Response)
    it("should save the genre if it is valid", async () => {
      await exec();

      const genre = await Genre.findOne({ name: "genre1" }); // directly query the database for the genre sent

      expect(genre).not.toBeNull();
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });

  describe("PUT /:id", () => {
    let token;
    let name;
    let id;

    const exec = async () => {
      return await request(server)
        .put(`/api/genres/${id}`)
        .set("x-auth-token", token)
        .send({ name });
    };

    beforeEach(async () => {
      token = new User().generateAuthToken();
      name = "genre1";
      const genre = new Genre({ name });
      await genre.save();
      id = genre._id;
      name = "genre2";
    });

    it("should return 401 if client is not logged in", async () => {
      token = "";

      const res = await exec();

      expect(res.status).toBe(401);
    });

    it("should return 404 if invalid id is passed", async () => {
      id = 1;

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return 400 if genre is less than 5 characters", async () => {
      name = "1234";

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return 400 if genre is more than 50 characters", async () => {
      name = new Array(52).join("a");

      const res = await exec();

      expect(res.status).toBe(400);
    });

    it("should return  404 if no genre with the given ID exists", async () => {
      id = new mongoose.Types.ObjectId();

      const res = await exec();

      expect(res.status).toBe(404);
    });

    it("should return the genre if it is valid", async () => {
      const res = await exec();

      expect(res.status).toBe(200);
      expect(res.body).toMatchObject({ name: "genre2" });
      expect(res.body).toHaveProperty("name", "genre2");
    });
  });
});
