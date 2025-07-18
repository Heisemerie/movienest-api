const Joi = require("joi");
const mongoose = require("mongoose");

// Joi customer schema
const schema = Joi.object({
  name: Joi.string().min(3).required(),
  isGold: Joi.boolean(),
  phone: Joi.string().pattern(/^\d+$/).min(5).required(),
});

// Mongoose customer schema
const customerSchema = new mongoose.Schema({
  name: { type: String, required: true, minLength: 3, maxLength: 50 },
  isGold: { type: Boolean, default: false },
  phone: { type: String, required: true, minLength: 5, maxLength: 50 },
});

// Mongoose Customer Model
const Customer = mongoose.model("Customer", customerSchema);

module.exports.Customer = Customer;
module.exports.schema = schema;
