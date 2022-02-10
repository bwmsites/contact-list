# Contactor

Simple application for managing contacts

## Installation

Please consider using the package manager [yarn](https://yarnpkg.com/getting-started/install) to install dependencies.

### Server

```bash
cd backend
```

and then

```bash
yarn install
```

### Client

```bash
cd contactor
```

and then

```bash
yarn install
```

## Usage

To help with project sharing we are using docker and docker-compose to handle a container to run the database. So first of executing the application run the container.

```bash
cd backend && docker-compose up -d postgres
```

Once you have the database up and running acess the server folder and execute the application

```bash
cd backend/src && yarn dev
```

### Important

Run the database migrations before sending any request to the server

```bash
node ace migration:run
```

If you want to start the application with some dummy data execute the command bellow

```bash
node ace db:seed
```

### Client

Once you have the server up and running execute the client application from the contactor folder

```bash
cd contactor && yarn start
```

## License

[MIT](https://choosealicense.com/licenses/mit/)
