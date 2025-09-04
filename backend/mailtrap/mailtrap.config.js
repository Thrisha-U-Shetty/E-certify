import { MailtrapClient } from "mailtrap";
import dotenv from "dotenv";

dotenv.config();

export const mailtrapClient = new MailtrapClient({
	endpoint: process.env.MAIL_TRAP_ENDPOINT,
	token: process.env.MAIL_TRAP_TOKEN,
});

export const sender = {
  email: "hello@demomailtrap.co",
  name: "E-certify",
};

// export const sender = {
//   email: "no-reply@ecertify.rf.gd",  // use your verified domain
//   name: "E-Certify",
// };
