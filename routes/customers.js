const express = require("express");
const router = express.Router();
const { schema, Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");

// Get All
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
  })
);

// Get
router.get(
  "/:id",
  asyncMiddleware(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");

    res.send(customer);
  })
);

// Post
router.post(
  "/",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });
    const result = await customer.save();

    res.send(result);
  })
);

// Update
router.put(
  "/:id",
  auth,
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        isGold: req.body.isGold,
        phone: req.body.phone,
      },
      { new: true }
    );

    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");

    res.send(customer);
  })
);

// Delete
router.delete(
  "/:id",
  [auth, admin],
  asyncMiddleware(async (req, res) => {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");

    res.send(customer);
  })
);

module.exports = router;
