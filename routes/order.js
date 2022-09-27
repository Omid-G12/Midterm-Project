const { getOrderItems } = require("../db/queries/database");
const express = require('express');
const router  = express.Router();

router.get ("/", (req, res) => {
  getOrderItems()
  .then (data => {
    res.json(data);
  })
});

module.exports = router;
