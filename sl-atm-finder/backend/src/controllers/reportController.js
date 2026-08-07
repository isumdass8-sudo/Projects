const Report = require('../models/Report');

async function getReports(req, res) {
  res.json(await Report.getAll(req.query.status));
}

async function submitReport(req, res) {
  const { problem } = req.body;
  if (!problem) return res.status(400).json({ error: 'problem description is required' });

  const id = await Report.create({
    atm_id: req.params.atmId,
    user_id: req.user?.user_id,
    problem,
  });
  res.status(201).json({ report_id: id });
}

async function updateReportStatus(req, res) {
  const { status } = req.body;
  if (!['open', 'in_progress', 'resolved'].includes(status)) {
    return res.status(400).json({ error: 'invalid status' });
  }
  await Report.updateStatus(req.params.id, status);
  res.json({ message: 'Report updated' });
}

module.exports = { getReports, submitReport, updateReportStatus };
