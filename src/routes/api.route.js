const path = require("path");
const express = require("express");
const router = express.Router();
const apiController = require(path.join(__dirname, "../controllers/api.controller.js"));

router.get("/create", apiController.homepage);

module.exports = router;