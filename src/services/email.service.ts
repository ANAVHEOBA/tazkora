import* as  nodemailer from "nodemailer";

let mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "wisdomvolt@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendVerificationEmail = async (
  emailTo: string,
  code: string,
  userName: string = 'User'
) => {
  const emailContent = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Email Verification Code</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: Arial, sans-serif;
          background-color: #f9f9f9;
          color: #333;
        }
        .email-container {
          max-width: 600px;
          margin: 20px auto;
          background: #ffffff;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
        }
        .email-header {
          background: #007bff;
          color: #ffffff;
          text-align: center;
          padding: 20px;
          font-size: 24px;
          font-weight: bold;
        }
        .email-body {
          padding: 20px;
        }
        .verification-code {
          background: #f8f9fa;
          padding: 15px;
          text-align: center;
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          margin: 20px 0;
          color: #007bff;
          border-radius: 4px;
        }
        .email-footer {
          background: #f1f1f1;
          text-align: center;
          padding: 10px;
          font-size: 12px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          Email Verification Code
        </div>
        <div class="email-body">
          <p>Hello ${userName},</p>
          <p>Your verification code is:</p>
          <div class="verification-code">
            ${code}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p style="margin-top: 20px;">
            Best regards,<br>
            Your App Team
          </p>
        </div>
        <div class="email-footer">
          &copy; 2024 Your App. All rights reserved.
        </div>
      </div>
    </body>
    </html>
  `;

  const mailDetails = {
    from: "wisdomvolt@gmail.com",
    to: emailTo,
    subject: "Email Verification Code",
    html: emailContent,
  };

  try {
    const data = await mailTransporter.sendMail(mailDetails);
    return data;
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
};