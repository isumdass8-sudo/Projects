const Bank = require('../models/Bank');

async function getAllBanks(req, res) {
  const banks = await Bank.getAll();
  res.json(banks);
}

async function searchBanks(req, res) {
  const { q } = req.query;
  if (!q) return res.json(await Bank.getAll());
  res.json(await Bank.search(q));
}

async function getBank(req, res) {
  const bank = await Bank.getById(req.params.id);
  if (!bank) return res.status(404).json({ error: 'Bank not found' });
  res.json(bank);
}

async function createBank(req, res) {
  try {
    const bank = await Bank.create(req.body);
    res.status(201).json(bank);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

async function updateBank(req, res) {
  const bank = await Bank.update(req.params.id, req.body);
  res.json(bank);
}

async function deleteBank(req, res) {
  await Bank.remove(req.params.id);
  res.status(204).send();
}

module.exports = { getAllBanks, searchBanks, getBank, createBank, updateBank, deleteBank };
