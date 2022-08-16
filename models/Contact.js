import mongoose from "mongoose";

export default mongoose.model(
  "contact",
  mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
      jobTitile: {
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
);
