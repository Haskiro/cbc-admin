FROM node:18-alpine as build
WORKDIR /opt/app
ADD *.json ./
RUN npm install
ADD . .
RUN npm run build

FROM node:18-alpine
RUN npm install -g serve
WORKDIR /opt/app
ADD *.json ./
RUN npm install --omit=dev
COPY --from=build /opt/app/dist ./dist
CMD serve -s -p 8080 dist

EXPOSE 8080