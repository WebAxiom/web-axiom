FROM node

COPY . /app
WORKDIR /app

ENV HOST 0.0.0.0

RUN npm install

EXPOSE 3000

ENTRYPOINT ["npm", "run", "dev"]