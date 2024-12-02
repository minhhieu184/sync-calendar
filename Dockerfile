FROM node:20.13.1-alpine3.20

WORKDIR /app

COPY package.json yarn.lock ./
COPY prisma/ ./prisma

RUN yarn

COPY . .

CMD ["yarn", "start:dev"]