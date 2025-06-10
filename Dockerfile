FROM node:18
COPY . /app
WORKDIR /app
RUN npm install
RUN npm install sqlite3
CMD [ "npm", "start" ]