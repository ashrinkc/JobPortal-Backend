import nodemailer from "nodemailer";
import "dotenv/config";
import User from "../models/Users.js"

let transporter = nodemailer.createTransport({
  pool: true,
  service: process.env.EMAIL_SERVICE_PROVIDER,
  auth: {
    type: "OAuth2",
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
    clientId: process.env.OAUTH_CLIENTID,
    clientSecret: process.env.OAUTH_CLIENT_SECRET,
    refreshToken: process.env.OAUTH_REFRESH_TOKEN,
  },
});
export async function mailToUser(data) {
  try {
    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: data.email,
      subject: "About Job application.",
      html: `<body style="background-color:#FFFFFF; color:#023243; font-size:15px; text-align: left"> 
      <h1 style =" text-align: center; color:#023243;"> Multi Employment Agency </h1>
      <p style="color:#023243; font-size:15px;"> Dear <b>${
        data.fullName
      }, </p></b>your job request have been successfully submitted! . 
        Thank you <b>${
          data.fullName
        } </b> for sending job application. <br/><br/>
      
    <i>Sincerely</i>,<br/>
    <i>Multi Employment Agency Admin.</i><br/>
    </body>`,
    });
    return true;
  } catch (err) {
    return false;
  }
}
export async function mailToAdmin(data) {
  try {
    const userData = await User.find({ isAdmin: true }).select(
      "email -_id name"
    );
    let admins = userData.map((obj) => obj.email);

    await transporter.sendMail({
      from: process.env.MAIL_USERNAME,
      to: admins,
      subject: "New Job Application ",
      html: `<body style="background-color:#FFFFFF; color:#023243; font-size:15px; text-align: left"> 
      <h1 style =" text-align: center; color:#023243;"> Multi Employment Agency </h1> 
      <p style="color:#023243; font-size:15px;">Dear Admin,</p>
      Mr./Mrs. <b>${data.fullName} </b> 
      has applied for the Job Title<b> ${data.jobTitle} </b>.
      <b>His/Her message is </b>
      ${data.description ? data.description : ""}

      Received message at <b>${new Date().toDateString()}.</b><br/>
       <br/>
       Applicant Contact:  ${data.contact}
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
}

