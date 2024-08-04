const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { updateSettings } = require("../controllers/settingsController");

router.put("/", auth, updateSettings);

module.exports = router;
