const express = require("express");
const {
  // getUserData,
  deleteUser,
  updateUser,
  getAllUserData,
} = require("../controllers/userController.js");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

//update User
router.put("/:id", verifyToken, updateUser);

//delete user
router.delete("/:id", verifyToken, deleteUser);

//get user
// router.get("/find/:id", verifyToken, getUserData);

//get all users
router.get("/user",verifyToken, getAllUserData);

module.exports = router;
