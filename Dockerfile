FROM node:20

ENV NODE_ENV=production
ENV USER_ID=

WORKDIR /app

RUN apt-get update -qq -y && \
    apt-get install -y vim wget

ADD . /app/

# install dependencies
RUN npm install --omit=dev
RUN npm install pm2 -g
RUN chmod +x /app/entrypoint.sh

CMD ["/bin/bash", "/app/entrypoint.sh"]
