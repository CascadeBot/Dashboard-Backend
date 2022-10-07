FROM node:18-alpine
WORKDIR /app

VOLUME [ "/app" ]
CMD npm i && npm run dev
