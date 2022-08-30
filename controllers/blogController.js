//database
require("../database/database.js");
const cloudinary = require("../utils/cloudinary.js");
//Blog Model
const Blog = require("../models/Blog");

// create blog (only admin can add job)
const createBlog = async (req, res) => {
  const { title, author, desc, img, metaTitle, metaKey, metaDesc } = req.body;
  // const body = req.body;
  // const newList = new Blog(body);

  try {
    const result = await cloudinary.uploader.upload(img, {
      folder: "products",
      // width: 300,
      // crop: "scale"
    });

    const product = await Blog({
      title,
      author,
      desc,
      img: {
        public_id: result.public_id,
        url: result.secure_url,
      },
      metaTitle,
      metaKey,
      metaDesc,
    });
    const ress = await product.save();
    res.status(200).json(ress);
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
