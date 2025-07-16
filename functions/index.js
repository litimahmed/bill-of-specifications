const functions = require("firebase-functions/v2/https");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "litimahmed67@gmail.com",
    pass: "enoj erct exqf ocfd",
  },
});

// Updated function with cors option
exports.sendEmailWithPDF = functions.onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 120,
    cors: ["http://localhost:3000"], // Allow requests from localhost:3000
  },
  async (req, res) => {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { formData, pdfBase64, recipient } = req.body;

    if (!formData || !recipient) {
      return res.status(400).send("Missing formData or recipient");
    }

    const mailOptions = {
      from: "litimahmed67@gmail.com",
      to: recipient,
      subject: "Marketplace Application Submission with PDF",
      text: `Marketplace Application Submission\n\n${formData}`,
      attachments: pdfBase64
        ? [
            {
              filename: "summary.pdf",
              content: pdfBase64.split("base64,")[1],
              encoding: "base64",
            },
          ]
        : [],
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log("Email sent:", info.response);
      return res.status(200).send("Email sent successfully");
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(500).send(`Error sending email: ${error.message}`);
    }
  }
);
