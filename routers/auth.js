const express = require("express");
const { createUser, loginUser } = require("../controllers/authController.js");
const router = express.Router();
const verifyToken = require('../middleware/verifyToken.js')

//register user
router.post("/register", verifyToken, createUser);

//login user
router.post("/login", loginUser);

module.exports = router;
