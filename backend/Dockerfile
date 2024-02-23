FROM node:lts

SHELL ["/bin/bash", "-c"]

WORKDIR /app

CMD corepack enable && yarn install && (node ./init-db.js & yarn dev)
