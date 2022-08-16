//database
require("../database/database.js");
//Category model
const Category = require("../models/Category");

//create category (only admin can create job)
const createCategory = async (req, res) => {
  const body = req.body;
  const newList = new Category(body);
  try {
    const result = await newList.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
};

//update Category (only admin can update job)
const updateCategory = async (req, res, next) => {
  try {
    const updateCategory = await Category.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
  } catch (error) {
    next(error);
  }
};

//delete category (only admin can create job)
const deleteCategory = async (req, res, next) => {
  try {
    const deleteCategory = await Category.findByIdAndDelete(req.params.id);
    return res.status(201).json(deleteCategory);
  } catch (error) {
    next(error);
  }
};

// get individual category by id
const getCategoryById = async (req, res, next) => {
  try {
    const result = await Category.findById(req.params.id);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

//get all Category
const getAllCategory = async (req, res, next) => {
  try {
    const data = await Category.find().sort({ _id: -1 });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategory,
  getCategoryById,
};
