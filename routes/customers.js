const express = require("express");
const router = express.Router();
const { schema } = require("../models/customer");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");
const asyncMiddleware = require("../middleware/async");
const validateObjectId = require("../middleware/validateObjectId");
const customerService = require("../services/customer.service");

// Get All
router.get(
  "/",
  asyncMiddleware(async (req, res) => {
    const customers = await customerService.getAll();

    res.send(customers);
  })
);

// Get
router.get(
  "/:id",
  validateObjectId,
  asyncMiddleware(async (req, res) => {
    const customer = await customerService.getById(req.params.id);
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

    const customer = await customerService.create(req.body);

    res.send(customer);
  })
);

// Update
router.put(
  "/:id",
  [auth, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const { error } = schema.validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const customer = await customerService.update(req.params.id, req.body);

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
  [auth, admin, validateObjectId],
  asyncMiddleware(async (req, res) => {
    const customer = await customerService.remove(req.params.id);

    if (!customer)
      return res
        .status(404)
        .send("The customer with the given ID was not found");

    res.send(customer);
  })
);

module.exports = router;
