// src/routes/messageRoutes.js
const express = require("express");
const router = express.Router();

// Define routes here
router.get("/", (req, res) => {
  res.send("Message route");
});

module.exports = router;
