const bycrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

//database
require("../database/database.js");

//user model
const User = require("../models/Users");

//register User
const createUser = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(200).json("enter all data");
  }
  try {
    // if the user email already exists
    const userEmail = await User.findOne({ email });
    if (userEmail) {
      return res.status(500).json("The similar email already exists");
    }
    const user = new User({ username, email, password });
    //generate salt to hash password
    const salt = await bycrypt.genSalt(12);
    //now we set user password to hashed password
    user.password = await bycrypt.hash(user.password, salt);
    const result = await user.save();
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

//loginUser
const loginUser = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(500).json("Empty fields");
  }
  const user = await User.findOne({ email });
  if (user) {
    //checking password with hashed password
    const validPassword = await bycrypt.compare(password, user.password);
    if (validPassword) {
      //jsonwebtoken is created
      const token = jwt.sign(
        { id: user.id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET_KEY,
        { expiresIn: "5d" }
      );
      res.cookie("jsonwebToken", token, {
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
        path: "/",
        httpOnly: true,
        sameSite: "lax",
      });
      const { password, ...others } = user._doc;
      res.status(200).json({ others, token });
    } else {
      res.status(400).json({ error: "Invalid data" });
    }
  } else {
    res.status(401).json({ error: "User does not exist" });
  }
};

module.exports = { createUser, loginUser };
