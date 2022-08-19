const express = require("express");
const router = express.Router();
const {
  addContact,
  getAllContact,
  deleteContact
} = require("../controllers/contactController.js");
const verifyToken = require('../middleware/verifyToken.js');

router.post("/", addContact);
router.get("/",verifyToken, getAllContact);
router.delete("/:id", verifyToken, deleteContact);

module.exports = router;
