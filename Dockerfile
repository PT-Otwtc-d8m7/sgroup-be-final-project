FROM node:22-alpine 

WORKDIR /app

COPY package*.json ./
COPY . .

RUN apk update
RUN npm install


EXPOSE 3000

CMD ["npm", "start"]