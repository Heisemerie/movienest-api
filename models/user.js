const Joi = require("joi");
const mongoose = require("mongoose");

// Joi user schema
const schema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  email: Joi.string().email().min(5).max(255).required(),
  password: Joi.string().min(5).max(255).required(), // string password max length (use joi-password-complexity for more complex requirements)
});

// Mongoose user schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 3,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 1024, // hashed password max length
  },
});

// Mongoose User model
const User = mongoose.model("User", userSchema);

module.exports.schema = schema;
module.exports.User = User;
