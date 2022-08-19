//database
require("../database/database.js");

//jobs model
const Jobs = require("../models/Jobs");

//create jobs(only admin can create jobs)
const createJobs = async (req, res) => {
  const body = req.body;
  const newList = new Jobs(body);
  try {
    const result = await newList.save();
    res.status(200).json(result);
  } catch (error) {
    res.status(200).json(error);
  }
};

//update jobs(only admin can update jobs)
const updateJobs = async (req, res, next) => {
  try {
    const updatedJobs = await Jobs.findByIdAndUpdate(req.params.id, {
      $set: req.body,
    });
  } catch (error) {
    next(error);
  }
};

// delete jobs (only admin can delete jobs)
const deleteJobs = async (req, res, next) => {
  try {
    const deleteJobs = await Jobs.findByIdAndDelete(req.params.id);
    return res.status(201).json(deleteJobs);
  } catch (err) {
    next(err);
  }
};

//get individual jobs by id
const getJobsById = async (req, res, next) => {
  try {
    const result = await Jobs.findById(req.params.id);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
};

//get all jobs
const getAllJobs = async (req, res, next) => {
  // const qcat = req.query.cat;
  try {
    //get all jobs according to user querys
    // let data;
    // if (qcat) {
    //   data = await Jobs.find({
    //     cat: {
    //       $in: [qcat],
    //     },
    //   });
    // } else {
    //    data = await Jobs.find().sort({ _id: -1 });
    // }
    const data = await Jobs.find().sort({ _id: -1 });
    res.status(201).json(data);
  } catch (error) {
    // next(error);
    console.log(error);
  }
};

module.exports = {
  createJobs,
  updateJobs,
  deleteJobs,
  getAllJobs,
  getJobsById,
};
