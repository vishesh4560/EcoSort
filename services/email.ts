import { User } from '../types';

// Configuration based on your request
// In a real production app, these would be in process.env on a backend server
const SMTP_CONFIG = {
  host: "smtp.office365.com",
  port: 587,
  secure: false,
  user: "vishverma830@outlook.com",
  from: "yourmail@outlook.com" // Mapped from your FROM_EMAIL
};

export const emailService = {
  sendWelcomeEmail: async (user: User) => {
    // Simulate network latency for a realistic experience
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Professional HTML Email Template
    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Welcome to EcoSort</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #1f2937; margin: 0; padding: 0; background-color: #f3f4f6; }
    .container { max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
    .header { background-color: #16a34a; padding: 32px; text-align: center; }
    .logo { color: #ffffff; font-size: 28px; font-weight: 800; text-decoration: none; letter-spacing: -0.5px; }
    .content { padding: 40px 32px; }
    .h1 { font-size: 24px; font-weight: 700; margin-bottom: 16px; color: #111827; }
    .p { margin-bottom: 16px; font-size: 16px; color: #4b5563; }
    .feature-list { list-style: none; padding: 0; margin: 24px 0; }
    .feature-item { display: flex; align-items: center; margin-bottom: 12px; color: #4b5563; }
    .check { color: #16a34a; margin-right: 12px; font-weight: bold; }
    .btn { display: inline-block; background-color: #16a34a; color: #ffffff; font-weight: 600; padding: 14px 32px; border-radius: 99px; text-decoration: none; margin-top: 24px; text-align: center; }
    .btn:hover { background-color: #15803d; }
    .footer { padding: 32px; text-align: center; background-color: #f9fafb; border-top: 1px solid #e5e7eb; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">EcoSort</div>
    </div>
    <div class="content">
      <h1 class="h1">Welcome, ${user.username}! 🌱</h1>
      <p class="p">We're thrilled to have you on board! You've taken the first step towards a cleaner, more sustainable planet.</p>
      
      <p class="p">With your new EcoSort account, you are ready to make a difference:</p>
      
      <ul class="feature-list">
        <li class="feature-item"><span class="check">✓</span> Instant AI Waste Identification</li>
        <li class="feature-item"><span class="check">✓</span> Personalized Recycling Tips</li>
        <li class="feature-item"><span class="check">✓</span> Track Your Environmental Impact</li>
      </ul>
      
      <div style="text-align: center;">
        <a href="https://ecosort.app/dashboard" class="btn">Start Scanning Now</a>
      </div>
    </div>
    <div class="footer">
      <p>© 2024 EcoSort. All rights reserved.</p>
      <p>Together for a greener future.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Log the mock email delivery
    console.group('📧 Mock Email Service: Welcome Email');
    console.log(`[SMTP] Connecting to ${SMTP_CONFIG.host}:${SMTP_CONFIG.port}... Connected.`);
    console.log(`[SMTP] Authenticating as ${SMTP_CONFIG.user}... Success.`);
    console.log(`From: "EcoSort Team" <${SMTP_CONFIG.from}>`);
    console.log(`To: ${user.email}`);
    console.log(`Subject: Welcome to EcoSort, ${user.username}! 🌱`);
    console.log('--- Email Content (HTML) ---');
    console.log(emailHtml);
    console.log('%c NOTE: This is a client-side simulation. Real email delivery requires a backend server.', 'color: orange; font-weight: bold;');
    console.groupEnd();

    // UI Notification dispatch removed per user request for signup process
    return true;
  },

  sendSecurityAlert: async (user: User, type: 'login' | 'signup') => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    const ip = "192.168.1.1 (Simulated)";
    const device = navigator.userAgent || "Unknown Device";
    
    const subject = type === "signup"
        ? "Security Alert: Signup Attempt"
        : "Security Alert: Login Attempt";

    const text = `
Hi,

A ${type.toUpperCase()} attempt was detected on your account.

📍 IP Address: ${ip}
🖥 Device: ${device}
🕒 Time: ${new Date().toLocaleString()}

If this was NOT you, please secure your account immediately.

– Ecosort Security
`;

    console.group('📧 Mock Email Service: Security Alert');
    console.log(`[SMTP] Connecting to ${SMTP_CONFIG.host}:${SMTP_CONFIG.port}... Connected.`);
    console.log(`[SMTP] Authenticating as ${SMTP_CONFIG.user}... Success.`);
    console.log(`From: "Ecosort Security" <${SMTP_CONFIG.from}>`);
    console.log(`To: ${user.email}`);
    console.log(`Subject: ${subject}`);
    console.log('--- Email Content (Text) ---');
    console.log(text);
    console.log('%c NOTE: This is a client-side simulation. Real email delivery requires a backend server.', 'color: orange; font-weight: bold;');
    console.groupEnd();

    // Trigger UI Notification for security alerts only
    window.dispatchEvent(new CustomEvent('email-sent', {
      detail: {
        to: user.email,
        subject: subject,
        type: 'warning'
      }
    }));

    return true;
  },

  sendPasswordReset: async (email: string) => {
    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 1200));

    const resetToken = Math.random().toString(36).substring(2);
    const resetLink = `https://ecosort.app/reset-password?token=${resetToken}`;

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: sans-serif; background-color: #f3f4f6; padding: 20px; }
    .container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; }
    .btn { display: inline-block; background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h2>Reset Your Password 🔒</h2>
    <p>We received a request to reset your EcoSort password. Click the button below to proceed.</p>
    <p>If you didn't request this, you can safely ignore this email.</p>
    <a href="${resetLink}" class="btn">Reset Password</a>
  </div>
</body>
</html>
    `;

    console.group('📧 Mock Email Service: Password Reset');
    console.log(`[SMTP] Connecting to ${SMTP_CONFIG.host}:${SMTP_CONFIG.port}... Connected.`);
    console.log(`To: ${email}`);
    console.log(`Subject: Reset Your Password`);
    console.log('--- Email Content ---');
    console.log(`Reset Link: ${resetLink}`);
    console.log('%c NOTE: This is a client-side simulation.', 'color: orange; font-weight: bold;');
    console.groupEnd();

    window.dispatchEvent(new CustomEvent('email-sent', {
      detail: {
        to: email,
        subject: 'Reset Password Request',
        type: 'success'
      }
    }));

    return true;
  }
};