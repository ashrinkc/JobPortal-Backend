const express = require("express");
const router = express.Router();
const {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  getBlogById,
} = require("../controllers/blogController.js");
const verifyToken = require("../middleware/verifyToken");

//create blog
router.post("/", createBlog);

//update blog
router.put("/:id", updateBlog);

//delete blog
router.delete("/:id", deleteBlog);

//get job by id
router.get("/find/:id", getBlogById);

//get all blog
router.get("/allBlog", getAllBlog);

module.exports = router;
