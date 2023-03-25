FROM node:14.17.0

WORKDIR /frontend

COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json

RUN npm ci
RUN npm install -g next
COPY . /frontend

EXPOSE 3001

CMD ["npm", "run", "dev"]