FROM node:22-alpine AS build

WORKDIR /app

ARG VITE_EMPLOYEE_API
ARG VITE_AUTH_API

ENV VITE_EMPLOYEE_API=$VITE_EMPLOYEE_API
ENV VITE_AUTH_API=$VITE_AUTH_API

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build


FROM nginx:1.29-alpine

RUN rm -rf /usr/share/nginx/html/*

COPY --from=build /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
