const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getMatches } = require("../controllers/matchController");

router.get("/", auth, getMatches); // Note: '/' refers to /api/matches based on server.js

module.exports = router;
