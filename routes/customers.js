const express = require("express");
const router = express.Router();
const { schema, Customer } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Get All
router.get("/", async (req, res, next) => {
  try {
    const customers = await Customer.find().sort({ name: 1 });
    res.send(customers);
  } catch (error) {
    next(error)
  }
});

// Get
router.get("/:id", async (req, res, next) => {
  try {
    const customer = await Customer.findById(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");

    res.send(customer);
  } catch (error) {
    next(error)
  }
});

// Post
router.post("/", auth, async (req, res, next) => {
  try {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = new Customer({
      name: req.body.name,
      isGold: req.body.isGold,
      phone: req.body.phone,
    });
    const result = await customer.save();

    res.send(result);
  } catch (error) {
    next(error)
  }
});

// Update
router.put("/:id", auth, async (req, res, next) => {
  try {
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
  } catch (error) {
    next(error)
  }
});

// Delete
router.delete("/:id", [auth, admin], async (req, res, next) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");

    res.send(customer);
  } catch (error) {
    next(error)
  }
});

module.exports = router;
