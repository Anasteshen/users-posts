# PostgreSQL migration

Contains a list of the database migration scripts(Migration scripts will be saved in `./migration`).

### Creating a migration

Run the following command to create a new database migration with the provided name.

```sh
npm run migration:create --name=<migrationName>
```

###### For example `npm run migration:create --name=AddColumnUserId`

### Generating a migration

Run the following command to generate a new migration based on changes with the provided name.

```sh
npm run migration:generate --name=<migrationName>
```

###### For example `npm run migration:create --name=AddColumnUserId`

### Running migrations

Run the following command to run all unapplied database migrations.

```sh
npm run migration:run
```

### Rolling back migrations

Run the following command to undo the last applied database migration.

```sh
npm run migration:revert
```

See: [https://typeorm.io/migrations#creating-a-new-migration](https://typeorm.io/migrations#creating-a-new-migration).
