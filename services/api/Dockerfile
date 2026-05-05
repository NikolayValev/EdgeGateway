FROM node:22-alpine

WORKDIR /app

# Install dependencies first (layer cache friendly)
COPY package.json ./
RUN npm install --omit=dev

# Copy application source
COPY index.js ./

EXPOSE 3000

CMD ["node", "index.js"]
