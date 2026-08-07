const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { authenticate } = require('../middleware/auth');

router.use(authenticate); // everything here requires login

router.get('/favorites', favoriteController.getFavorites);
router.post('/favorites/:atmId', favoriteController.addFavorite);
router.delete('/favorites/:atmId', favoriteController.removeFavorite);
router.get('/recently-viewed', favoriteController.getRecentlyViewed);

module.exports = router;
