const router = require('express').Router();
const { getAllDestinations, getDestinationById } = require('../controllers/destinations.controller');

router.get('/', getAllDestinations);
router.get('/:id', getDestinationById);

module.exports = router;
