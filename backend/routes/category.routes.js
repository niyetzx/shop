const express = require('express');
const router = express.Router();
const Category = require('../models/category');
const { auth, isAdmin } = require('../middleware/auth');

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find();
        res.json(categories);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/', auth, isAdmin, async (req, res) => {
    const category = new Category({
        name: req.body.name,
        description: req.body.description,
    });

    try {
        const newCategory = await category.save();
        res.status(201).json(newCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.put('/:id', auth, isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }

        if (req.body.name) category.name = req.body.name;
        if (req.body.description) category.description = req.body.description;

        const updatedCategory = await category.save();
        res.json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', auth, isAdmin, async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Категория не найдена' });
        }

        await category.deleteOne();

        res.json({ message: 'Категория удалена' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
