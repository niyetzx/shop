const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();  // Инициализируем dotenv раньше

const app = express();  // Создаем app сразу после dotenv
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || "mongodb://mongodb:27017/storedb";

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products'); // ✅ продуктовые роуты
const categoryRoutes = require('./routes/category.routes'); // категории

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); // Статические файлы

// Подключаем маршруты после объявления app
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes); // лучше явно указать /api/products
app.use('/api/categories', categoryRoutes);

// Подключение к MongoDB
mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log("MongoDB connection error:", err));

// Запускаем сервер
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
