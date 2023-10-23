FROM node:16.15.0-slim
WORKDIR /app
COPY package*.json ./ 
RUN npm install
COPY . .
ENV PORT=4000
# ENV MYSQL_HOST=YOUR-PRODUCTION-MYSQL-HOST
CMD ["node", "app.js"]
