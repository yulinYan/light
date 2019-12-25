FROM hub.dh.com/library/nginx:1.16.1-alpine
RUN apk add --update curl && rm -rf /var/cache/apk/*
COPY nginx.conf /etc/nginx/nginx.conf
COPY . /www
HEALTHCHECK --interval=10s --timeout=3s CMD /usr/bin/curl -I -XGET -fs http://127.0.0.1/serverconfig.json || exit 1
