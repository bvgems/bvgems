import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "bvgemsinc@gmail.com",
    pass: "owcc qvch lnjo mpgm",
  },
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `BV Gems`,
    to,
    subject,
    html,
  });
};
