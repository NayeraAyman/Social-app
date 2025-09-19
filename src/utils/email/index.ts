import nodemailer from "nodemailer";
import { devConfig } from "../../config/env/dev.config";

export async function sendMail(to: string, subject: string, html: string) {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: devConfig.EMAIL_USER,
      pass: devConfig.EMAIL_PASS,
    },
  });

  //send mail
  await transporter.sendMail({
    from: `"social app"<${devConfig.EMAIL_USER}>`,
    to: to as string,
    subject: subject as string,
    html: html as string,
  });
}
