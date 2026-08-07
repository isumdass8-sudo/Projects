const Favorite = require('../models/Favorite');
const SearchHistory = require('../models/SearchHistory');

async function getFavorites(req, res) {
  res.json(await Favorite.getByUser(req.user.user_id));
}

async function addFavorite(req, res) {
  await Favorite.add(req.user.user_id, req.params.atmId);
  res.status(201).json({ message: 'Added to favorites' });
}

async function removeFavorite(req, res) {
  await Favorite.remove(req.user.user_id, req.params.atmId);
  res.status(204).send();
}

async function getRecentlyViewed(req, res) {
  res.json(await SearchHistory.getRecent(req.user.user_id));
}

module.exports = { getFavorites, addFavorite, removeFavorite, getRecentlyViewed };
