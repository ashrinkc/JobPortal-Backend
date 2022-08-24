require("../database/database.js");
const bcrypt = require("bcrypt");
const User = require("../models/Users.js");

//user models
const updateUser = async (req, res, next) => {
  try {
    if (req.body.params) {
      const salt = await bcrypt.genSalt(12);
      req.body.password = await bcrypt.hash(req.body.password, salt);
    }
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    return res.status(201).json(updateUser);
  } catch (error) {
    next(error);
  }
};

//delete user
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    return res.status(201).json({ message: "delete success", user });
  } catch (err) {
    next(err);
  }
};

//get admin user
const getAllUserData = async (req, res) => {
  try {
    const user = await User.find();
    return res.status(201).json(user);
  } catch (error) {
    return res.status(500).json(error);
    
  }
};

module.exports = { updateUser, deleteUser, getAllUserData };
