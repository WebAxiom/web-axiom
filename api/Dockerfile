FROM node

COPY . /api
WORKDIR /api

RUN apt-get update -y
RUN apt-get install -y axiom

RUN npm install

EXPOSE 3001

ENTRYPOINT ["npm", "start"]