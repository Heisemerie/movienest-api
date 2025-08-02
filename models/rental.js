const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { customerSchema } = require("./customer");

// Joi rental schema
const schema = Joi.object({
  customerId: Joi.objectId().required(),
  movieId: Joi.objectId().required(),
});

// Mongoose rental schema
const rentalSchema = new mongoose.Schema({
  customer: {
    type: customerSchema, // mosh created a custom schema (with the essential properties) because importing the schema forces you to use all the schema properties
    required: true,
  },
  movie: {
    type: new mongoose.Schema({
      title: {
        type: String,
        required: true,
        trim: true,
        minLength: 3,
        maxLength: 255,
      },
      dailyRentalRate: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
      },
    }), // custom movie schema (subset of movie schema with essential properties)
    required: true,
  },
  dateOut: { type: Date, required: true, default: Date.now }, // set automatically
  dateReturned: { type: Date },
  rentalFee: { type: Number, min: 0 },
});

// Mongoose rental model
const Rental = mongoose.model("Rental", rentalSchema);

module.exports.schema = schema;
module.exports.Rental = Rental;
