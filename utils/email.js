import { createTransport } from "nodemailer";
import config from "../config.js";
import { erro } from "./utils.js";


// configure
  const transporter = createTransport({
    service: "gmail",
    auth: {
      user: config.global.email,
      pass: config.global.pass,
    },
  });
  

// send email
export const sendEmail = (to, sub, text, template) => {
  if (!to && !sub && (!text || !template))
  return Promise.reject(erro("missing data to send mail"));

 
  return transporter.sendMail({
    from: config.global.email,
    to : to,
    subject: sub,
    text: text,
    html: template,
  });
};