// routes/favorites.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Favorite = require('../models/favorite.model');

// Получить избранное пользователя
router.get('/', auth, async (req, res) => {
    const favorites = await Favorite.find({ userId: req.user.id });
    res.json(favorites);
});

// Добавить товар в избранное
router.post('/', auth, async (req, res) => {
    const exists = await Favorite.findOne({ userId: req.user.id, productId: req.body.productId });
    if (exists) return res.status(400).json({ message: 'Уже в избранном' });

    const favorite = new Favorite({ userId: req.user.id, productId: req.body.productId });
    await favorite.save();
    res.status(201).json(favorite);
});

// Удалить товар из избранного
router.delete('/:productId', auth, async (req, res) => {
    await Favorite.findOneAndDelete({ userId: req.user.id, productId: req.params.productId });
    res.status(204).send();
});

module.exports = router;
