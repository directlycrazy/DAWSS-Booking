FROM node:lts-alpine

ARG RESEND_KEY
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET

RUN mkdir -p /opt/app

WORKDIR /opt/app

COPY package*.json ./

RUN npm install

COPY . .

ENV RESEND_KEY=${RESEND_KEY}
ENV BETTER_AUTH_URL=${BETTER_AUTH_URL}
ENV BETTER_AUTH_SECRET=${BETTER_AUTH_SECRET}

RUN mkdir database
RUN npm run migrate
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "prod:start"]