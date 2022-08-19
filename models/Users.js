const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    contactEmail: {
      type: String,
    },
    contact: {
      type: Number,
      default: "",
    },
    password: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    brandname: {
      type: String,
      default: "",
    },
    logo: {
      type: String,
      default: "",
    },
    facebook: {
      type: String,
      default: "",
    },
    twitter: {
      type: String,
      default: "",
    },
    insta: {
      type: String,
      default: "",
    },
    metaTitle: {
      type: String,
    },
    metaKey: {
      type: String,
    },
    metaDesc: {
      type: String,
    },
    address: {
      type: String,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("Admin", userSchema);
module.exports = User;
