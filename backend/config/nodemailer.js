const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Startup test — server চালু হলে connection verify করবে
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error.message);
  } else {
    console.log('✅ Email service ready.');
  }
});

const sendStatusEmail = async ({ toEmail, graduateName, jobTitle, status }) => {
  const statusMessages = {
    shortlisted: `Congratulations! You have been shortlisted for "${jobTitle}".`,
    rejected: `Thank you for applying. Unfortunately, your application for "${jobTitle}" was not selected.`,
    hired: `🎉 Congratulations! You have been hired for "${jobTitle}"!`,
    pending: `Your application for "${jobTitle}" is under review.`,
  };

  const mailOptions = {
    from: `"CareerBridge BD" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: `Application Update — ${jobTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1e3a8a; padding: 24px; text-align: center;">
          <h1 style="color: #fff; margin: 0;">CareerBridge BD</h1>
        </div>
        <div style="padding: 32px; background-color: #f8fafc;">
          <h2 style="color: #0f172a;">Hello, ${graduateName}!</h2>
          <p style="color: #475569; font-size: 16px; line-height: 1.6;">
            ${statusMessages[status]}
          </p>
          <div style="background-color: #fff; border-radius: 8px; padding: 20px; margin: 24px 0; border-left: 4px solid #1e3a8a;">
            <p style="margin: 0; color: #374151;"><strong>Job:</strong> ${jobTitle}</p>
            <p style="margin: 8px 0 0; color: #374151;"><strong>Status:</strong> 
              <span style="color: #1e3a8a; font-weight: bold; text-transform: capitalize;">${status}</span>
            </p>
          </div>
          <p style="color: #64748b; font-size: 14px;">
            Login to CareerBridge BD to view your application details.
          </p>
        </div>
        <div style="background-color: #1e3a8a; padding: 16px; text-align: center;">
          <p style="color: #bfdbfe; margin: 0; font-size: 13px;">
            © 2026 CareerBridge BD — Job Portal for Fresh Graduates of Bangladesh
          </p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendStatusEmail };