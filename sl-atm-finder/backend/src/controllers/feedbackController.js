const Feedback = require('../models/Feedback');

async function getFeedbackForAtm(req, res) {
  const feedback = await Feedback.getByAtm(req.params.atmId);
  const summary = await Feedback.getAverageRating(req.params.atmId);
  res.json({ feedback, summary });
}

async function submitFeedback(req, res) {
  const { rating, machine_working, cash_available, parking_available, comment } = req.body;
  if (!rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'rating must be between 1 and 5' });
  }
  const id = await Feedback.create({
    atm_id: req.params.atmId,
    user_id: req.user.user_id,
    rating, machine_working, cash_available, parking_available, comment,
  });
  res.status(201).json({ feedback_id: id });
}

module.exports = { getFeedbackForAtm, submitFeedback };
