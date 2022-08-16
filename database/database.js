const mongoose = require("mongoose");
const dotenv = require("dotenv");

mongoose
  .connect(
    "mongodb+srv://ashrin:ashrin@cluster0.lhbk7vu.mongodb.net/?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected to database");
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = mongoose;
