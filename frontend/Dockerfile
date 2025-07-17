# Используем официальный образ Node.js
FROM node:18-alpine 

# Устанавливаем рабочую директорию
WORKDIR /app 

# Копируем package.json и устанавливаем зависимости
COPY package.json ./
RUN npm install 

# Копируем остальные файлы
COPY . . 

# Запуск Vite-сервера
CMD ["npm", "run", "dev"]
