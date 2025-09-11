import nodemailer from "nodemailer";

export async function sendMail(to: string, subject: string, html: string) {
  //create transporter
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //send mail
  await transporter.sendMail({
    from: "'social app'<nayeraaymanahmed@gmail.com>",
    to: to as string,
    subject: subject as string,
    html: html as string,
  });
}
