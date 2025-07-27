const Joi = require("joi");
const mongoose = require("mongoose");

// Joi genre schema
const schema = Joi.object({ name: Joi.string().min(3).required() });

// Mongoose genre schema
const genreSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 5, maxLength: 50 },
});

// Mongoose Genre model
const Genre = mongoose.model("Genre", genreSchema);

module.exports.schema = schema;
module.exports.Genre = Genre;
module.exports.genreSchema = genreSchema