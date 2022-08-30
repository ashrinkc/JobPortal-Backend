const express = require("express");
const app = express();
const cors = require("cors");
const fileupload = require("express-fileupload");
// importing routes
const jobsRoutes = require("./routers/jobs.js");
const authRoutes = require("./routers/auth.js");
const blogRoutes = require("./routers/blog.js");
const categoryRoutes = require("./routers/category.js");
const userRoutes = require("./routers/user.js");
const contactRoutes = require("./routers/contact.js");

// dotenv file for config file
const dotenv = require("dotenv").config();
const PORT = process.env.PORT || 5000
// import "dotenv/config";


//middleware for json format
app.use(express.json());
app.use(fileupload({ useTempFiles: true }));

//database
require("./database/database.js");
app.use(cors());
//routes
app.use("/api/v1/jobs", jobsRoutes);
app.use("/api/v1/auth", authRoutes);
// app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
// app.use("/api/v1/category", categoryRoutes);
app.use("/api/v1/contact", contactRoutes);

app.listen(PORT, () => {
  console.log(`running in port number ${PORT}`);
});
