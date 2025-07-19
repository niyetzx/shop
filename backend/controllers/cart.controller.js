const Cart = require('../models/cart.model');

// Получить корзину текущего пользователя
exports.getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id }).populate('items.product');
        if (!cart) return res.status(200).json({ items: [] }); // Пустая корзина
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении корзины' });
    }
};

// Добавить или обновить товар
exports.addToCart = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        let cart = await Cart.findOne({ user: req.user.id });

        if (!cart) {
            // Создаём новую корзину
            cart = new Cart({
                user: req.user.id,
                items: [{ product: productId, quantity }],
            });
        } else {
            // Проверяем, есть ли уже этот товар
            const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);

            if (itemIndex > -1) {
                // Обновляем количество
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при добавлении товара в корзину' });
    }
};

// Обновить количество товара
exports.updateQuantity = async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Корзина не найдена' });

        const item = cart.items.find(item => item.product.toString() === productId);
        if (!item) return res.status(404).json({ message: 'Товар не найден в корзине' });

        item.quantity = quantity;
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении количества' });
    }
};

// Удалить товар из корзины
exports.removeFromCart = async (req, res) => {
    const { productId } = req.params;

    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Корзина не найдена' });

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();

        res.status(200).json(cart);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении товара' });
    }
};

// Очистить корзину
exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) return res.status(404).json({ message: 'Корзина не найдена' });

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: 'Корзина очищена' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при очистке корзины' });
    }
};
