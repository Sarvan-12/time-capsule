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
    console.log(`Production: Email successfully sent via SendGrid to ${options.email}`);
  } catch (error) {
    // If SendGrid is still reviewing, it will catch here
    console.error('SendGrid Production Error:', error.response ? error.response.body : error.message);
    throw new Error('Email could not be sent yet (SendGrid account likely pending review)');
  }
};

module.exports = sendEmail;
