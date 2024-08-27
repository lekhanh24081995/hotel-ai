# Stage 1: Build the React application
FROM node:18.17.1-alpine as build

WORKDIR /app

RUN npm install --global pm2

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

# Run container as non-root (unprivileged) user
# The "node" user is provided in the Node.js Alpine base image
# USER node

# Launch app with PM2
# CMD ["pm2-runtime", "start", "npm", "--", "run", "dev"]
CMD [ "pm2-runtime", "start", "npm", "--", "start" ]