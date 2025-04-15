# Frontend install and run
Be in directory map-frontend.
```shell
npm install
npm i @maptiler/sdk
npm run dev
```
# Backend run

The backend uses a postgresq database locally on your machine. This must be started before starting the backend service.

Be in directory map-backend.

## Running application using mvnw
```shell
DB_USERNAME=<user-name> DB_PASSWORD=<password> ./mvnw spring-boot:run
```

## Running application from jar
Build jar file:
```shell
./mvnw package
```
Run:
```shell
DB_USERNAME=<user-name> DB_PASSWORD=<password> java -jar target/<jar-file>
```

## Running application as docker container
Build docker image:
```shell
docker build -t stf-map-backend .
```
Run in docker container:
```shell
docker run --network="host" -e DB_USERNAME=<user-name> -e DB_PASSWORD=<password> stf-map-backend:latest
```

