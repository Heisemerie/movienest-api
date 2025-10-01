const request = require("supertest");
const { Rental } = require("../../../models/rental");
const { User } = require("../../../models/user");
const mongoose = require("mongoose");

// POST /api/returns {customerId, movieId}

// Return 401 if client is not logged in
// Return 400 if customerId is not provided
// Return 400 if movieId is not provided
// Return 404 if no rental found for this customer/movie
// Return 400 if rental already processed
// Return 200 if valid request
// Set return date
// Calculate rental fee
// Increase the stock
// Return the rental

let server;

describe("/api/returns", () => {
  let customerId;
  let token;
  let movieId;
  let rental;

  beforeEach(async () => {
    server = require("../../../index");

    customerId = new mongoose.Types.ObjectId().toHexString();
    movieId = new mongoose.Types.ObjectId().toHexString();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: { _id: movieId, title: "12345", dailyRentalRate: 2 },
    });
    await rental.save();
  });

  afterEach(async () => {
    await server.close();
    await Rental.deleteMany({});
  });

  const exec = () => {};

  it("should return 401 if client is not logged in", async () => {
    const res = await request(server)
      .post(`/api/returns`)
      .send({ customerId, movieId });

    expect(res.status).toBe(401);
  });

  it("should return 400 if customerId is not provided", async () => {
    token = new User().generateAuthToken();

    const res = await request(server)
      .post(`/api/returns`)
      .set("x-auth-token", token)
      .send({ movieId });

    expect(res.status).toBe(400);
  });
});
