FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install

# Установка nodemon глобально
RUN npm install -g nodemon

COPY . .

CMD ["nodemon", "index.js"]
