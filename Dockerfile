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
RUN pm2 install pm2-logrotate
RUN pm2 set pm2-logrotate:compress true
RUN pm2 set pm2-logrotate:dateFormat YYYY-MM-DD_HH-mm-ss
RUN pm2 set pm2-logrotate:rotateInterval '*/5 * * * *'
RUN pm2 set pm2-logrotate:max_size 10M
RUN pm2 set pm2-logrotate:retain 2
RUN chmod +x /app/entrypoint.sh

CMD ["/bin/bash", "/app/entrypoint.sh"]
