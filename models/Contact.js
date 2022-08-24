const mongoose = require("mongoose");

const contactModel = mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      jobTitle: {
        type: String,
        required: true,
      },
      contact:{
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      message: {
        type: String,
      },
    },
    {
      timestamps: true,
    }
  )

const ContactModel = mongoose.model("contact", contactModel);

module.exports = ContactModel;