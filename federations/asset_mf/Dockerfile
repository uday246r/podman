FROM node:20-alpine AS build

WORKDIR /app

# Enable pnpm via corepack
RUN corepack enable pnpm

ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install

COPY . .
RUN pnpm run build

FROM nginx:1.29-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
