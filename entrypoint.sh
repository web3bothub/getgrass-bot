#!/bin/bash

pm2 flush
pm2 delete all

USER_ID=${USER_ID} pm2 start /app/start.js

pm2 logs
