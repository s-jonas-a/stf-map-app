# Frontend install and run
```shell
cd map-frontend
npm install
npm i @maptiler/sdk
npm run dev
```
# Backend run

The backend uses a postgresq database locally on your machine. This must be started before starting the backend service.

```shell
cd map-backend
DB_USERNAME=<user-name> DB_PASSWORD=<password> ./mvnw spring-boot:run
```
