FROM nginx:1.17.0-alpine

COPY ./nginx-default.conf /etc/nginx/conf.d/default.conf
COPY . /usr/share/nginx/html

EXPOSE 80