const express = require('express');
const router = express.Router();
const Cart = require('../models/cart');
const Product = require('../models/product');
const { auth } = require('../middleware/auth');

// Получить корзину текущего пользователя
router.get('/', auth, async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        res.json(cart || { user: req.user._id, items: [] });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении корзины', error: error.message });
    }
});

// Добавить или обновить товар в корзине
router.post('/add', auth, async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
        return res.status(400).json({ message: 'Неверные данные для добавления в корзину' });
    }

    try {
        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);

        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        cart.updatedAt = new Date();
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении товара', error: error.message });
    }
});

// Удалить товар из корзины
router.delete('/remove/:productId', auth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $pull: { items: { product: req.params.productId } }, $set: { updatedAt: new Date() } },
            { new: true }
        );

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении товара', error: error.message });
    }
});

// Очистить корзину
router.delete('/clear', auth, async (req, res) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: req.user._id },
            { $set: { items: [], updatedAt: new Date() } },
            { new: true }
        );
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при очистке корзины', error: error.message });
    }
});

// Обновить количество товара
router.patch('/update', auth, async (req, res) => {
    const { productId, quantity } = req.body;

    if (!productId || quantity < 1) {
        return res.status(400).json({ message: 'Неверные данные' });
    }

    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) return res.status(404).json({ message: 'Корзина не найдена' });

        const item = cart.items.find(item => item.product.toString() === productId);

        if (item) {
            item.quantity = quantity;
            cart.updatedAt = new Date();
            await cart.save();
            return res.json(cart);
        } else {
            return res.status(404).json({ message: 'Товар не найден в корзине' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении', error: error.message });
    }
});

module.exports = router;
