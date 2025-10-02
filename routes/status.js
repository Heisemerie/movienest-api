const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ status: "MovieNest API running 🚀" });
});

module.exports = router;
