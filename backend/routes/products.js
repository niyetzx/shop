const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const { auth, isAdmin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Получить все товары (авторизованные)
router.get('/', auth, async (req, res) => {
    try {
        const products = await Product.find().populate('category', 'name');
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении товаров', error: error.message });
    }
});


// Загрузка изображений отдельно (если нужно)
router.post('/upload', auth, isAdmin, upload.array('images', 5), (req, res) => {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: 'Файлы не загружены' });
    }

    const fileUrls = req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`);
    res.status(200).json({ images: fileUrls });
});

// Добавление товара
router.post('/', auth, isAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, category } = req.body;

        if (!name || !price || !category) {
            return res.status(400).json({ message: 'Название, цена и категория обязательны' });
        }

        const imageUrls = req.files?.length
            ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
            : [];

        const product = new Product({
            name,
            price,
            category,
            images: imageUrls,
            createdBy: req.user._id
        });

        await product.save();
        res.status(201).json(product);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при добавлении товара', error: error.message });
    }
});

// Удаление товара
router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }
        res.json({ message: 'Товар успешно удалён' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении товара', error: error.message });
    }
});

// Редактирование товара
router.put('/:id', auth, isAdmin, upload.array('images', 5), async (req, res) => {
    try {
        const { name, price, category } = req.body;

        const imageUrls = req.files?.length
            ? req.files.map(file => `${req.protocol}://${req.get('host')}/uploads/${file.filename}`)
            : undefined;

        const updatedFields = {
            ...(name && { name }),
            ...(price && { price }),
            ...(category && { category }),
            ...(imageUrls && { images: imageUrls })
        };

        const product = await Product.findByIdAndUpdate(req.params.id, updatedFields, { new: true });

        if (!product) {
            return res.status(404).json({ message: 'Товар не найден' });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: 'Ошибка при редактировании товара', error: error.message });
    }
});

// Агрегация по категориям
router.get('/aggregate', auth, isAdmin, async (req, res) => {
    try {
        const aggregateData = await Product.aggregate([
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$price' },
                    count: { $sum: 1 }
                }
            }
        ]);
        res.json(aggregateData);
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при получении статистики', error: error.message });
    }
});

module.exports = router;
