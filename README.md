## Start up / Usage

Use following commands to start the app

To install all necessary dependencies

```bash
$ npm install
```

Create .env file and fill it with Environment variables.
To see the list of environment variables go [Environment variables](#Environment-variables)

```bash
$ touch .env
```

## Running the app

###### `note` Before running the app, ensure that Docker, npm, and Node.js are pre-installed.

```bash
$ make start
```

## Environment variables

| Name                    | Value Type Options | Default Value           | Description                 |
| :---------------------- | :----------------- | :---------------------- | :-------------------------- |
| `APP_PORT`              | `Number`           | `3000`                  | Default port                |
| `NODE_ENV`              | `String`           | `DEVELOPMENT`           | Default port                |
| `POSTGRES_DB`           | `String`           | `test_task`             | Default database name       |
| `POSTGRES_PORT`         | `Number`           | `5432`                  | Default database name       |
| `POSTGRES_HOST`         | `String`           | `localhost`             | Default Postgresql host     |
| `POSTGRES_USER`         | `String`           | `postgres`              | Default Postgresql user     |
| `POSTGRES_PASSWORD`     | `String`           | `postgres`              | Default Postgresql password |
| `AUTH0_AUDIENCE`        | `String`           | `https://auth0/test`    | Auth0 Audience              |
| `AUTH0_ISSUER_URL`      | `String`           | `https://{yourUrl}`     | Auth0 Issuer URL            |
| `AUTH0_CLIENT_ID`       | `String`           | `your secret`           | Auth0 Client ID             |
| `AUTH0_CLIENT_SECRET`   | `String`           | `your secret`           | Auth0 Client Secret         |
| `AUTH0_DOMAIN`          | `String`           | `your domain`           | Auth0 Domain                |
| `AUTH0_CONNECTIONS`     | `String`           | `database name`         | Auth0 Connections           |
| `AWS_REGION`            | `String`           | `ap-south-1`            | AWS Region                  |
| `S3_BUCKET`             | `String`           | `test-task`             | S3 Bucket                   |
| `AWS_ACCESS_KEY_ID`     | `String`           | `test`                  | AWS Access Key ID           |
| `AWS_SECRET_ACCESS_KEY` | `String`           | `test`                  | AWS Secret Access Key       |
| `LOCALSTACK_HOST`       | `String`           | `http://localhost:4566` | Localstack Host             |
