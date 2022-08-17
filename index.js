const express = require("express");
import { Router } from "express";
const app = express();
const cors = require("cors");
// importing routes
const jobsRoutes = require("./routers/jobs.js");
const authRoutes = require("./routers/auth.js");
const blogRoutes = require("./routers/blog.js");
const categoryRoutes = require("./routers/category.js");
const userRoutes = require("./routers/user.js");
const contactRoutes = require("./routers/contact.js");
import { noRouteValidator } from "./utils/validator.js";


// dotenv file for config file
// const dotenv = require("dotenv");
import "dotenv/config";

// const PORT = 5000;
const apiRoute = Router();

//middleware for json format
app.use(express.json());

//database
require("./database/database.js");
app.use(cors());
//routes
app.use("/api/v1/jobs", jobsRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/category", categoryRoutes);
apiRoute.use("/api/v1/contact", contactRoutes);
app.use("/api", apiRoute);

app.use("*", (req, res) => {
  noRouteValidator(res);
});


app.listen(PORT, () => {
  console.log(`running in port number ${process.env.PORT}`);
});
