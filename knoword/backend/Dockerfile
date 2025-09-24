FROM node:lts-alpine3.21

WORKDIR /app

COPY package*.json ./
RUN npm install

# No copies todo aquí, el código lo montamos con volumes
# COPY . . 

EXPOSE 8000

CMD ["npm", "run", "start:dev"]
