const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
      required: true,
    },
    img: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
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
  },
  { timestamps: true }
);

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
