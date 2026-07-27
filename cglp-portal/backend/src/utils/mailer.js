const nodemailer = require('nodemailer');
require('dotenv').config();

let transporter = null;

function getTransporter() {
  if (transporter) return transporter;
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) return null;

  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
  return transporter;
}

/**
 * Sends an email. Fails silently (logs a warning) if email isn't configured,
 * so the rest of the app keeps working even without Gmail credentials set.
 */
async function sendMail({ to, subject, html }) {
  const t = getTransporter();
  if (!t) {
    console.warn(`[mailer] Skipped email to ${to} ("${subject}") — GMAIL_USER/GMAIL_APP_PASSWORD not set in .env`);
    return { skipped: true };
  }

  try {
    await t.sendMail({
      from: `"Ceylon Green Life Plantation (Demo)" <${process.env.GMAIL_USER}>`,
      to,
      subject,
      html
    });
    return { skipped: false };
  } catch (err) {
    console.error('[mailer] Failed to send email:', err.message);
    return { skipped: true, error: err.message };
  }
}

function welcomeEmail(user) {
  return sendMail({
    to: user.email,
    subject: 'Welcome to Ceylon Green Life Plantation',
    html: `
      <p>Hi ${user.full_name},</p>
      <p>Your account has been created. You can now log in and browse
      partnership plans, contribute, and track your monthly income from
      your dashboard.</p>
      <p>— Ceylon Green Life Plantation (student demo project)</p>
    `
  });
}

function contributionEmail(user, plan, contribution) {
  return sendMail({
    to: user.email,
    subject: `Contribution confirmed — ${plan.name}`,
    html: `
      <p>Hi ${user.full_name},</p>
      <p>Your contribution of <strong>Rs. ${Number(contribution.amount).toLocaleString()}</strong>
      to <strong>${plan.name}</strong> has been recorded, at a locked-in monthly
      rate of ${(plan.monthly_rate * 100).toFixed(2)}% for ${plan.duration_months} months.</p>
      <p>You can view your growth and download your agreement/certificate from your dashboard.</p>
      <p>— Ceylon Green Life Plantation (student demo project)</p>
    `
  });
}

module.exports = { sendMail, welcomeEmail, contributionEmail };
