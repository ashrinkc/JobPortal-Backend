const nodemailer = require("nodemailer");
const dotenv = require("dotenv").config();
const User = require("../models/Users.js");

let transporter = nodemailer.createTransport({
  // pool: true,
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
});

const mailToUser = async (data) => {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: data.email,
      subject: "About Job application.",
      html: `<body style="background-color:#FFFFFF; color:#023243; font-size:15px; text-align: left"> 
      <h1 style =" text-align: center; color:#023243;"> Multi Employment Agency </h1>
      <p style="color:#023243; font-size:15px;"> Dear <b>${data.fullName}, </p></b>Your job application has been submitted successfully. 
       </b> Thank you for sending your preferred job application. <br/><br/>
      
    <i>Sincerely</i>,<br/>
    <i>Multi Employment Agency Admin.</i><br/>
    </body>`,
    });
    return true;
  } catch (err) {
    return false;
  }
};

const mailToAdmin = async (data) => {
  try {
    // const userData = await User.find({ isAdmin: true }).select(
    //   "email -_id name"
    // );
    // let admins = userData.map((obj) => obj.email);

    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: process.env.ADMIN_EMAIL,
      subject: "New Job Application ",
      html: `<body style="background-color:#FFFFFF; color:#023243; font-size:15px; text-align: left"> 
      <h1 style =" text-align: center; color:#023243;"> Multi Employment Agency </h1> 
      <p style="color:#023243; font-size:15px;">Dear Admin,</p>
      Mr./Mrs. <b>${data.fullName} </b> 
      has applied for the Job Title<b> ${data.jobTitle} </b>.
      
      <br/>
      His/Her message is 
      <b> ${data.description ? data.description : ""}. </b>

      <br/>
      <br/>

      Received mail at <b>${new Date().toDateString()}.</b><br/>
       <br/>
       Applicant Details,
      <br/>
        Name: ${data.fullName}
       <br/> 
       Contact:  ${data.contact}
       <br/> 
       Email: ${data.email} 
       <br/>
       Address: ${data.address} 
       <br/>
      </body>
      `,
    });
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};

module.exports = { mailToAdmin, mailToUser };
