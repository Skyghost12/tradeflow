import nodemailer from "nodemailer";

/**
 * Sends transactional emails (password reset, etc.) via SMTP.
 * Configure SMTP_* env vars — works with Gmail app passwords,
 * SendGrid, Mailgun, or any standard SMTP provider.
 */
const sendEmail = async ({ to, subject, html }) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: Number(process.env.SMTP_PORT) === 465,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to,
    subject,
    html,
  });
};

export default sendEmail;
