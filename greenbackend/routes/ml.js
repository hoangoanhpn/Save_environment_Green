const express = require("express");
const router = express.Router();
const ML = require("../controllers/mlcontrollers")

router.route("/").get(ML.getTensor);

module.exports = router;