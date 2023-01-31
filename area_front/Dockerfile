FROM cirrusci/flutter:stable AS build
WORKDIR /usr/src/build
COPY . .
RUN flutter pub get
RUN flutter build web
RUN ls /usr/src/build/build/web

FROM python:3-alpine AS prod
WORKDIR /usr/src/app
RUN ls /usr/src/app
COPY --from=build /usr/src/build/build/web/. .
RUN ls /usr/src/app
RUN mkdir /usr/src/apk
CMD ["/bin/sh", "-c", "cp /usr/src/apk/client.apk .;'python' -m http.server 8081"]