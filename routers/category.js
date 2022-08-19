const express = require("express");
const { verify } = require("jsonwebtoken");
const router = express.Router();
const {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
} = require("../controllers/categoryController.js");
const verifyToken = require("../middleware/verifyToken");

//create Category
router.post("/", verifyToken, createCategory);

//update Category
router.put("/:id", verifyToken, updateCategory);

//delete Category
router.delete("/:id", verifyToken, deleteCategory);

//get job by id
router.get("/find/:id", getCategoryById);

//get all category
router.get("/allCategory", getAllCategory);

module.exports = router;
