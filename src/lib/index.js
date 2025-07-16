import * as functions from "firebase-functions";
import nodemailer from "nodemailer";

// Configure Nodemailer with your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "", // Replace with your Gmail
    pass: "", // Use an App Password from Gmail
  },
});

exports.sendEmailWithPDF = functions.https.onRequest((req, res) => {
  const { formData, pdfBase64, recipient } = req.body;

  const mailOptions = {
    from: "", // Replace with your Gmail
    to: recipient,
    subject: "Marketplace Application Submission with PDF",
    text: `Marketplace Application Submission\n\n${formData}`,
    attachments: [
      {
        filename: "summary.pdf",
        content: pdfBase64.split("base64,")[1], // Remove data URI prefix
        encoding: "base64",
      },
    ],
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      res.status(500).send("Error sending email");
    } else {
      console.log("Email sent:", info.response);
      res.status(200).send("Email sent successfully");
    }
  });
});
