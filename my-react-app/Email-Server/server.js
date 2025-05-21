// Load environment variables from .env
require('dotenv').config();

// Import required packages
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const nodemailer = require('nodemailer');

// Initialize Express
const app = express();

// Middleware
app.use(cors()); // Enable CORS for all origins
app.use(bodyParser.json()); // Parse JSON bodies

// Configure Nodemailer transport using Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS,
  },
});

// Email sending endpoint
app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: 'All fields are required.',
    });
  }

  try {
    await transporter.sendMail({
      from: `"Website Contact" <${process.env.GMAIL_USER}>`,
      to: process.env.RECEIVER,
      replyTo: email,
      subject: `Contact from ${name}`,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
    });

    res.status(200).json({ success: true, message: 'Email sent successfully!' });
  } catch (error) {
    console.error('Mail error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// Fallback route for undefined endpoints
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
