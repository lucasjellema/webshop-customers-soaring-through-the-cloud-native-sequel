FROM nginx:1.10.2-alpine

COPY web /usr/share/nginx/html
EXPOSE 80