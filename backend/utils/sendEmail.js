// utils/sendEmail.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const sendEmail = async (to, subject, text) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
    
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      text
    });
    
    console.log(`Email sent to ${to}`);
    return true;
  } catch (err) {
    console.error('Email sending error:', err);
    return false;
  }
};

module.exports = sendEmail;
