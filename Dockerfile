FROM node:22.22.0-alpine3.23
WORKDIR /app
COPY . .
RUN npm install
ENV DB_URI="mongodb://localhost:27017,localhost:27018,localhost:27019/vidly?replicaSet=rs0"
ENV JWT_SECRET="mySecretKey"
ENV PORT=3000
EXPOSE 3000