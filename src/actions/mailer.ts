"use server";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendWelcomeEmail(recipientEmail: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipientEmail,
    subject: "Welcome to Technorollix 2027!",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
          .header { text-align: center; margin-bottom: 20px; }
          .otp { font-size: 2rem; font-weight: bold; letter-spacing: 0.5rem; text-align: center; padding: 20px; background: #111; color: #fff; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header"><h1>Technorollix 2027</h1></div>
          <p>Dear Participant,</p>
          <p>Thank you for registering for Technorollix 2027! Please use the following OTP to verify your email:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes. If you did not register, please ignore this email.</p>
          <p>Best regards,<br/>The Technorollix 2027 Team</p>
          <div class="footer"><p>&copy; 2027 Technorollix. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

export async function sendResetPasswordEmail(recipientEmail: string, otp: string): Promise<void> {
  const mailOptions = {
    from: process.env.SMTP_USER,
    to: recipientEmail,
    subject: "Reset Your Password — Technorollix 2027",
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f9f9f9; }
          .otp { font-size: 2rem; font-weight: bold; letter-spacing: 0.5rem; text-align: center; padding: 20px; background: #111; color: #fff; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; font-size: 0.9em; color: #777; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Reset Your Password</h1>
          <p>We received a request to reset your Technorollix 2027 password. Use the OTP below:</p>
          <div class="otp">${otp}</div>
          <p>This OTP is valid for 10 minutes. If you did not request this, please ignore this email.</p>
          <p>Best regards,<br/>The Technorollix 2027 Team</p>
          <div class="footer"><p>&copy; 2027 Technorollix. All rights reserved.</p></div>
        </div>
      </body>
      </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error("Error sending reset password email:", error);
  }
}
