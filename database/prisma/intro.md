# Introduction to Prisma

## Overview of Prisma

- There's three main methods to configure of Prisma ORM:
  1. **Data Source**: It determines the database type like PostgresSQL, MongoDB and details like connection URL should define inside `prisma.config.ts` file under `datasource` property. Connection URL here is for only handing the "schema" and "migration" of the database.
  2. **Generator**: It determines which assets are created when we run `prisma generate`, it generates "typed query methods based on model", "auto-completion for queries","type-safe database access" and "prisma client" to access the database.
  3. **Model**: It defines the structure of the data in the database, it's the high level representation of the database schema, and it should be defined inside `prisma.schema` file.

## Migration in Prisma

- It's used to sync the **database schema with the Prisma schema**, as well as **update the generated** Prisma Client.
- It's generates a migration file that contains the snapshot of the database between the current and previous state of the schema, and it should be stored in `prisma/migrations` folder.
- It mainly consists of two commands:
  1. `prisma migrate dev`: It applies the migrations to your database and updates the generated Prisma Client.
  2. `prisma db pull`: It pulls the database schema and updates your Prisma schema file.

## Prisma Client

## Important Prisma Commands

| Command              | Description                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `prisma init`        | Initializes a new Prisma project.                                                        |
| `prisma generate`    | Generates Prisma Client (Application Programming Interface) based on your Prisma schema. |
| `prisma migrate dev` | Applies migrations to your database (maps Prisma schema to underlying database).         |
| `prisma db pull`     | Pulls the database schema and updates your Prisma schema file.                           |
