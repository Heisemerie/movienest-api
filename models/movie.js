const Joi = require("joi");
Joi.objectId = require("joi-objectid")(Joi);
const mongoose = require("mongoose");
const { genreSchema } = require("../models/genre");

// Joi movie schema
const schema = Joi.object({
  title: Joi.string().min(3).required(),
  genreId: Joi.objectId().required(), // genreId not genre (because we want the cutomer to send the ID of the genre ie API req)
  numberInStock: Joi.number().min(0).required(),
  dailyRentalRate: Joi.number().min(0).required(),
});

// Mongoose movie schema
const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    minLength: 3,
    maxLength: 255,
  },
  genre: {
    type: genreSchema, // genreId in Joi schema is used to fetch genre document and store. genre is unlikely to change (hence the choice to embed ie hybrid)
    required: true,
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255,
  },
});

// Mongoose movie model
const Movie = mongoose.model("Movie", movieSchema);

module.exports.schema = schema;
module.exports.Movie = Movie;
module.exports.movieSchema = movieSchema;
