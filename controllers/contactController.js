import mongoose from "mongoose";
import Contact from "../models/Contact.js";
import {
  bodyValidator,
  emptyFieldValidator,
  emptyQueryValidator,
  nameValidator,
  emailValidator,
  contactValidator,
} from "../utils/validator.js";
import { mailToUser, mailToAdmin } from "../helpers/mailer.js";

export const addContact = async (req, res) => {
  try {
    let { fullName, jobTitle, address, contact, email, message } = req.body;
    if (emptyQueryValidator(req.query, res) || bodyValidator(req.body, res))
      return;

    let fields = [fullName, job, address, number, email];
    if (emptyFieldValidator(fields, res)) return;

    let job = jobTitle.trim();
    let description = message.trim();

    if (nameValidator(fullName) != true) {
      return res.status(422).json({
        msg: "Invalid Name!",
      });
    }
    if (emailValidator(email) != true) {
      return res.status(422).json({
        msg: "Invalid Email!",
      });
    }
    if (contactValidator(contact) != true) {
        return res.status(422).json({
          msg: "Invalid Contact!",
        });
      }

    const newContact = new Contact({
      fullName,
      jobTitle: job,
      address,
      contact,
      email,
      message: description,
    });

    let newContactData = await newContact.save();
    if (!newContactData) {
      res.status(500).json({
        msg: "Failed to apply for Job !",
      });
    }
    
    const mailData = {
        email,
        fullName,
        contact,
        jobTitle,
        address,
        description
    } 
    await mailToUser(mailData);
    await mailToAdmin(mailData);
    res.status(200).json({
      msg: "Job applied successfully !",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const getAllContact = async (req, res) => {
//   try {
//     const getAllContact = await contactModel.find({ isDelete: false });
//     res.status(200).json({ data: getAllContact });
//   } catch (err) {
//     res.status(400).json({
//       msg:
//         "There was an error while getting all contact details: " + err.message,
//     });
//   }
// };

// const getOneContact = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const getContactById = await contactModel
//       .findOne({
//         $and: [{ _id: req.params.id, isDelete: false }],
//       })
//       .select("-isDelete");
//     res.status(200).json({ data: getContactById });
//   } catch (err) {
//     res.status(400).json({
//       msg: "There was an error while getting contact details: " + err.message,
//     });
//   }
// };

// const deleteContact = async (req, res) => {
//   try {
//     const id = req.params.id;
//     const getContactById = await contactModel.findByIdAndUpdate(id, {
//       isDelete: true,
//     });
//     res.status(200).send({ msg: "contact deleted successfully" });
//   } catch (err) {
//     res.status(400).json({
//       msg: "There was an  error while deleting contact: " + err.message,
//     });
//   }
// };

// export default { addContact, getAllContact, getOneContact, deleteContact };
