FROM node:16.13.1-alpine3.14

RUN apk -U upgrade \
  && apk add --no-cache \
    git \
    openssh

RUN mkdir -p /usr/src/app

# Create app directory
WORKDIR /usr/src/app

# Install system app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN echo "Date: `date`" > ./version.txt

RUN ["npm", "install"]
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

CMD ["npm", "run", "start"]

# This is not ready, there are known bugs with cluster mode (state management between nodes, like path in remote shell etc...)
#CMD ["npm", "run", "cluster-runtime"]
