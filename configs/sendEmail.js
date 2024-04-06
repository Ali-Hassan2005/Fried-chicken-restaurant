const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.service,
  auth: {
    user: process.env.email,
    pass: process.env.password,
  },
});

module.exports = async (opition) => {
  await transporter.sendMail({
    from: process.env.email,
    to: opition.email, // list of receivers
    subject: opition.subject, // Subject line
    html: opition.html, // html body
  });
};
