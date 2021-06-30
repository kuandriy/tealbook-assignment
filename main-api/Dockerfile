FROM node:14
WORKDIR /usr/src/app
COPY package.json ./
COPY . .
RUN npm install -g nodemon
RUN npm ci
EXPOSE 8080
CMD npm run dev