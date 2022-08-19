const express = require("express");
const router = express.Router();
const {
  addContact,
  getAllContact,
  deleteContact,
} = require("../controllers/contactController.js");

router.post("/", addContact);
router.get("/", getAllContact);
router.delete("/:id", deleteContact);

module.exports = router;
