FROM node:16.15.1-alpine

LABEL version="1.0"
LABEL description="Development Image for Social Backend"

WORKDIR /app

COPY ./package.json ./

ARG NODE_ENV

RUN if [ "$NODE_ENV" = "development" ]; \
        then npm install && npm cache clean --force; \
        else npm install --only=production; \
        fi

COPY . .

# use EXPOSE command to have our port mapped by the docker daemon
EXPOSE 4000

# default dev command
CMD [ "npm", "start" ]