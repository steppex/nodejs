FROM node:14.18.2-slim
RUN yarn config set registry https://registry.npmmirror.com/

WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

ARG COMMIT_SHA

ARG ENV=test
ENV NODE_ENV=${ENV}

ARG PORT=3000
ENV HTTP_PORT=${PORT}

EXPOSE ${PORT}

CMD node ./dist/main