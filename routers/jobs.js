const express = require("express");
const router = express.Router();
const {
  createJobs,
  updateJobs,
  deleteJobs,
  getAllJobs,
  getJobsById,
} = require("../controllers/jobsController.js");
const verifyToken = require("../middleware/verifyToken");

//create jobs
router.post("/", createJobs);

//update jobs
router.put("/:id", updateJobs);

//delete jobs
router.delete("/:id", deleteJobs);

//get job by id
router.get("/find/:id", getJobsById);

//get all jobs
router.get("/allJobs", getAllJobs);

module.exports = router;
