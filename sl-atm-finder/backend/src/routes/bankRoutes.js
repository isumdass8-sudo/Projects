const express = require('express');
const router = express.Router();
const bankController = require('../controllers/bankController');
const { authenticate, requireAdmin } = require('../middleware/auth');

router.get('/', bankController.getAllBanks);
router.get('/search', bankController.searchBanks);
router.get('/:id', bankController.getBank);

// Admin-only
router.post('/', authenticate, requireAdmin, bankController.createBank);
router.put('/:id', authenticate, requireAdmin, bankController.updateBank);
router.delete('/:id', authenticate, requireAdmin, bankController.deleteBank);

module.exports = router;
