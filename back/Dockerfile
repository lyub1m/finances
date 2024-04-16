FROM node:18.16.1

WORKDIR /app/

COPY --chown=node:node ./app/package*.json ./
RUN npm i -P

COPY --chown=node:node ./app/tsconfig*.json ./
COPY --chown=node:node ./app/src ./src/
COPY --chown=node:node ./app/database ./database/
RUN ls -la
RUN npm run build
USER node
RUN ls -la
CMD ["npm", "run", "start:prod"]