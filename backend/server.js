import express from "express";
import nodemailer from "nodemailer";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Mail transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test route (email ka direct test)
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "✅ Test Email",
      text: "Email setup is working!",
    });
    res.send("Email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed");
  }
});

// Your existing error trigger route
app.post("/send-error-email", async (req, res) => {
  try {
    const { error_name, error_message } = req.body;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.ADMIN_EMAIL,
      subject: "🚨 Webcam Error Alert",
      text: `
Webcam Error Detected

Error: ${error_name}
Message: ${error_message}
Time: ${new Date().toISOString()}
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Email send failed" });
  }
});

app.listen(3000, () => {
  console.log("Email server running on http://localhost:3000");
});