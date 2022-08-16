const express = require("express");
const { createUser, loginUser } = require("../controllers/authController.js");
const router = express.Router();

//register user
router.post("/register", createUser);

//login user
router.post("/login", loginUser);

module.exports = router;
