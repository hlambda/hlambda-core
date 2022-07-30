FROM node:lts-alpine3.15

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

# RUN echo "`date`" > ./image-build-time.txt
RUN echo "`date +%s`" > ./image-build-timestamp.txt

RUN ["npm", "install"]
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

# Install node_modules in metadata folder on build
RUN cd ./metadata && npm install --only=production 

# At the point of building image we also want to move metadata folder with npm modules to data/metadata-examples
RUN cp -r ./metadata ./data/metadata-examples

CMD ["npm", "run", "start"]

# This is not ready, there are known bugs with cluster mode (state management between nodes, like path in remote shell etc...)
#CMD ["npm", "run", "cluster-runtime"]

