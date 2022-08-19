const mongoose = require("mongoose");

const jobSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    desc: {
      type: String,
    },
    location: {
      type: String,
    },
    cat: {
      type: String,
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

const Jobs = mongoose.model("JOBS", jobSchema);

module.exports = Jobs;
