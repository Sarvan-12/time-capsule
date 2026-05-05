const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS, // Your 16-char App Password
    },
  });

  const mailOptions = {
    from: `"Time Capsule" <${process.env.EMAIL_FROM}>`,
    to: options.email,
    subject: options.subject,
    html: options.html,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`🚀 GMAIL SUCCESS: Email sent to ${options.email}`);
  } catch (error) {
    console.error('Gmail Error:', error.message);
    throw new Error('Email could not be sent via Gmail');
  }
};

module.exports = sendEmail;
