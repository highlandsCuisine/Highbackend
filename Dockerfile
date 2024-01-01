FROM node:20

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install -g pm2

RUN npm install express-session

RUN apt-get update \
    && apt-get install -y \
        chromium \
        libgconf-2-4 \
        libexif12 \
        libgl1-mesa-dri \
        libgl1-mesa-glx \
        libxi6 \
        libxrender1 \
        libxss1 \
        libxtst6 \
    && rm -rf /var/lib/apt/lists/*

COPY . .

RUN npm run tailwind:css

EXPOSE 8000

CMD ["node", "index.js"]
