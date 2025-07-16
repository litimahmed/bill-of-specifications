import * as functions from "firebase-functions";
import nodemailer from "nodemailer";

// Configure Nodemailer with your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "litimahmed67@gmail.com", // Replace with your Gmail
    pass: "Abdelghafor31@", // Use an App Password from Gmail
  },
});

exports.sendEmailWithPDF = functions.https.onRequest((req, res) => {
  const { formData, pdfBase64, recipient } = req.body;

  const mailOptions = {
    from: "litimahmed67@gmail.com",
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
