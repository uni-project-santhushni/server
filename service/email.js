import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

var transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export const sendTextEmail = async (email, subject, text) => {
  try {
    await transporter.sendMail({
      from: "DairyCow Nexus <uc.chamod.public@gmail.com>",
      to: email,
      subject: subject,
      text: text,
    });
  } catch (err) {
    console.log(err);
    return new Error("An error occurred while sending the email");
  }
};

export const sendHtmlEmail = async ( email, subject, html) => {
  try {
    await transporter.sendMail({
      from:"DairyCow Nexus <uc.chamod.public@gmail.com>",
      to: email,
      subject: subject,
      html: html,
    });
  } catch (err) {
    console.log(err);
    return new Error("An error occurred while sending the email");
  }

}
