FROM node:14.16.1

WORKDIR /frontend

COPY package.json /frontend/package.json
COPY package-lock.json /frontend/package-lock.json

RUN npm ci
COPY . /frontend

EXPOSE 3001

CMD ["npm", "run", "dev"]