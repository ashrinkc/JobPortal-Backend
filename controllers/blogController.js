//database
require("../database/database.js");

//Blog Model
const Blog = require("../models/Blog");

// create blog (only admin can add job)
const createBlog = async (req, res) => {
  const body = req.body;
  const newList = new Blog(body);
  console.log(body);
  try {
    const result = await newList.save();
    res.status(200).json(result);
  } catch (err) {
    res.status(200).json(err);
  }
};

//update blog(only admin can update blog)
const updateBlog = async (req, res, next) => {
  try {
    const updatedBlog = await Blog.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
  } catch (error) {
    next(error);
  }
};

//delete blog(Only admin can delete job)
const deleteBlog = async (req, res, next) => {
  try {
    const deleteBlog = await Blog.findByIdAndDelete(req.params.id);
    return res.status(201).json(deleteBlog);
  } catch (error) {
    next(error);
  }
};

// get individual blog by id
const getBlogById = async (req, res, next) => {
  try {
    const result = await Blog.findById(req.params.id);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

// get all blog
const getAllBlog = async (req, res, next) => {
  try {
    const data = await Blog.find().sort({ _id: -1 });
    res.status(201).json(data);
  } catch (err) {
    console.log(err);
  }
};

module.exports = {
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlog,
  getBlogById,
};
