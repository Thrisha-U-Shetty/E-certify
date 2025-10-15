import {
  PASSWORD_RESET_REQUEST_TEMPLATE,
  PASSWORD_RESET_SUCCESS_TEMPLATE,
  VERIFICATION_EMAIL_TEMPLATE,
  CERTIFICATE_EMAIL_TEMPLATE
} from "./emailTemplates.js";
import { brevoTransporter, sender } from "./brevo.config.js";

// ----------------- Verification Email -----------------
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const response = await brevoTransporter.sendMail({
      from: sender, // { name, address } format in brevo.config.js
      to: email,
      subject: "Verify your email",
      html: VERIFICATION_EMAIL_TEMPLATE.replace("{verificationCode}", verificationToken),
    });

    console.log("✅ Verification email sent:", response.messageId || response);
  } catch (error) {
    console.error("❌ Error sending verification email:", error);
    throw new Error(`Error sending verification email: ${error.message}`);
  }
};

// ----------------- Password Reset Request -----------------
export const sendPasswordResetEmail = async (email, resetURL) => {
  try {
    const response = await brevoTransporter.sendMail({
      from: sender,
      to: email,
      subject: "Reset your password",
      html: PASSWORD_RESET_REQUEST_TEMPLATE.replace("{resetURL}", resetURL),
    });

    console.log("✅ Password reset email sent:", response.messageId || response);
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    throw new Error(`Error sending password reset email: ${error.message}`);
  }
};

// ----------------- Password Reset Success -----------------
export const sendResetSuccessEmail = async (email) => {
  try {
    const response = await brevoTransporter.sendMail({
      from: sender,
      to: email,
      subject: "Password Reset Successful",
      html: PASSWORD_RESET_SUCCESS_TEMPLATE,
    });

    console.log("✅ Password reset success email sent:", response.messageId || response);
  } catch (error) {
    console.error("❌ Error sending password reset success email:", error);
    throw new Error(`Error sending password reset success email: ${error.message}`);
  }
};
export const sendCertificateEmail = async (userEmail, userName, pdfBuffer, certDetails) => {
  try {
    const { certificateTitle, certificateNumber } = certDetails;

    // Replace placeholders in the template
    const htmlContent = CERTIFICATE_EMAIL_TEMPLATE
      .replace(/{userName}/g, userName)
      .replace(/{certificateTitle}/g, certificateTitle);

    const response = await brevoTransporter.sendMail({
      from: sender,
      to: userEmail,
      subject: certificateTitle,
      html: htmlContent,
      attachments: [
        {
          filename: `Certificate_${certificateNumber}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
    });

    console.log("✅ Certificate email sent:", response.messageId || response);
  } catch (error) {
    console.error("❌ Error sending certificate email:", error);
    throw new Error(`Error sending certificate email: ${error.message}`);
  }
};
