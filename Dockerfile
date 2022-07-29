FROM node:14

USER root

RUN mkdir /app

WORKDIR /app

COPY package*.json .

RUN yarn install
RUN yarn global add nodemon
RUN yarn global add supervisor

EXPOSE 8082

CMD ["/bin/bash", "src/scripts/init.sh"]
