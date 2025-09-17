import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const brevoTransporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // smtp-relay.brevo.com
  port: process.env.SMTP_PORT, // 587
  auth: {
    user: process.env.SMTP_USER, // your Brevo login (example: 955514001@smtp-brevo.com)
    pass: process.env.SMTP_PASS, // your SMTP key
  },
});
console.log("SMTP Config:", {
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  user: process.env.SMTP_USER,
  from: process.env.FROM_EMAIL,
});

export const sender = {
  name: "E-Certify",
  address: process.env.FROM_EMAIL, // e.g., ecertify5@gmail.com
};
