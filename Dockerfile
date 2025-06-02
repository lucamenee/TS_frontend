FROM node:20.19-alpine

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

RUN mkdir -p /usr/src/app/.angular/cache && chown -R node:node /usr/src/app/.angular


EXPOSE 4200

USER node


CMD ["npm", "start"]