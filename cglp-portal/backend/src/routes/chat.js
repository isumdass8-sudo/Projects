const express = require('express');
const pool = require('../config/db');

const router = express.Router();

/**
 * A rule-based "simulated AI assistant" — no external API calls, so it's
 * completely free to run. Matches keywords in the customer's message
 * against canned responses built from the live `plans` table. Good enough
 * for a student demo, and worth a line in your project writeup explaining
 * the trade-off vs. a real LLM-backed chatbot.
 */
function findAnswer(message, plans) {
  const text = message.toLowerCase();

  const greeted = /\b(hi|hello|hey)\b/.test(text);
  if (greeted && text.length < 20) {
    return "Hi! I'm the CGLP assistant (simulated for this demo). Ask me about our partnership plans, minimum contributions, monthly rates, or how the dashboard works.";
  }

  if (/\b(plan|plans|option|options)\b/.test(text)) {
    const list = plans.map((p) => `• ${p.name} — Rs. ${Number(p.min_contribution).toLocaleString()} min, ${(p.monthly_rate * 100).toFixed(2)}%/month, ${p.duration_months} months`).join('\n');
    return `We currently offer ${plans.length} partnership plans:\n${list}\n\nAsk me about a specific one, like "tell me about Estate Cultivation".`;
  }

  for (const p of plans) {
    if (text.includes(p.name.toLowerCase()) || text.includes(p.code.replace('-', ' '))) {
      return `${p.name}: ${p.description} Minimum contribution is Rs. ${Number(p.min_contribution).toLocaleString()}, at a locked-in monthly rate of ${(p.monthly_rate * 100).toFixed(2)}% for a ${p.duration_months}-month term.`;
    }
  }

  if (/\b(minimum|min contribution|how much)\b/.test(text)) {
    const cheapest = [...plans].sort((a, b) => a.min_contribution - b.min_contribution)[0];
    return `Minimum contributions range by plan — the lowest is ${cheapest.name} at Rs. ${Number(cheapest.min_contribution).toLocaleString()}. Ask about a specific plan for its exact minimum.`;
  }

  if (/\b(rate|interest|income|return|monthly)\b/.test(text)) {
    return 'Each plan has a locked-in monthly rate (shown on its plan page) applied to your contribution amount. Your dashboard shows a month-by-month breakdown of accrued income once you\'ve contributed.';
  }

  if (/\b(dashboard|track|progress)\b/.test(text)) {
    return 'Your dashboard shows all your active contributions, a growth chart of income earned so far, and a full payout schedule. You can also download a PDF agreement and a QR-coded certificate for each contribution from there.';
  }

  if (/\b(certificate|qr|agreement|pdf)\b/.test(text)) {
    return 'Once you\'ve made a contribution, go to your Dashboard and use "Download agreement" or "Download certificate" on that contribution\'s card. The certificate includes a scannable QR code linking to a public verification page.';
  }

  if (/\b(document|upload|kyc|id)\b/.test(text)) {
    return 'You can upload supporting documents (PDF, PNG, or JPG, up to 10MB) from the Documents section at the bottom of your Dashboard.';
  }

  if (/\b(contact|human|agent|speak|call|phone)\b/.test(text)) {
    return 'For anything I can\'t help with, use the Contact page to send a message — it\'ll be logged for the team to follow up on.';
  }

  return "I'm a simulated assistant built for this demo, so my answers are limited to plans, contributions, the dashboard, and documents. Try asking something like \"What's the minimum for Managed Cultivation?\" or check the Contact page for anything else.";
}

// POST /api/chat  { message }
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const [plans] = await pool.query('SELECT * FROM plans ORDER BY sort_order');
    const reply = findAnswer(message, plans);

    // Small artificial delay so it still feels like it's "thinking" — purely cosmetic.
    await new Promise((r) => setTimeout(r, 400));

    res.json({ reply });
  } catch (err) {
    console.error('[chat] error:', err.message);
    res.status(500).json({ error: 'The chatbot ran into a problem. Please try again.' });
  }
});

module.exports = router;