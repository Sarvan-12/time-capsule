const sgMail = require('@sendgrid/mail');

const sendEmail = async (options) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);

  const msg = {
    to: options.email,
    from: process.env.EMAIL_FROM, // Must be verified in SendGrid
    subject: options.subject,
    html: options.html,
  };

  try {
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${options.email}`);
  } catch (error) {
    console.error('SendGrid Error:', error.response ? error.response.body : error.message);
    throw new Error('Email could not be sent');
  }
};

module.exports = sendEmail;
