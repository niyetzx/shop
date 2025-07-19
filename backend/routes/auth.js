const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { auth, isAdmin, generateToken } = require('../middleware/auth');

router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({
            username,
            email,
            password,
            role: 'user' // Default role
        });

        await user.save();
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error: error.message });
    }
});

router.patch('/change-password', auth, async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const user = await User.findById(req.user._id);

        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).json({ message: 'Текущий пароль неверен' });
        }

        user.password = newPassword;
        await user.save();

        res.json({ message: 'Пароль успешно изменен' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при изменении пароля', error: error.message });
    }
});

router.get('/profile', auth, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
});

router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'profile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ message: 'Invalid updates' });
    }

    try {
        updates.forEach(update => req.user[update] = req.body[update]);
        await req.user.save();
        res.json(req.user);
    } catch (error) {
        res.status(400).json({ message: 'Error updating profile', error: error.message });
    }
});

router.get('/users', auth, isAdmin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
});

router.patch('/users/:id/role', auth, isAdmin, async (req, res) => {
    try {
        const { role } = req.body;
        if (!['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role' });
        }

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.role = role;
        await user.save();
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
});

router.post('/users', auth, isAdmin, async (req, res) => {
    try {
        const { username, email, password, role } = req.body;

        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Пользователь уже существует' });
        }

        if (role && !['user', 'admin'].includes(role)) {
            return res.status(400).json({ message: 'Недопустимая роль' });
        }

        const user = new User({
            username,
            email,
            password,
            role: role || 'user'
        });

        await user.save();

        res.status(201).json({
            message: 'Пользователь успешно создан',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при создании пользователя', error: error.message });
    }
});

router.delete('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        // Prevent self-deletion
        if (req.params.id === req.user._id.toString()) {
            return res.status(400).json({ message: 'Невозможно удалить свой собственный аккаунт' });
        }

        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        res.json({ message: 'Пользователь успешно удален' });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при удалении пользователя', error: error.message });
    }
});

router.patch('/users/:id', auth, isAdmin, async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Пользователь не найден' });
        }

        if (username) user.username = username;
        if (email) user.email = email;

        if (password && password.trim() !== '') {
            user.password = password;
        }

        await user.save();

        res.json({
            message: 'Пользователь обновлён',
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Ошибка при обновлении пользователя', error: error.message });
    }
});


module.exports = router;