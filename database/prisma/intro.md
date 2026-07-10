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

## Prisma Schema

- A Prisma schema consists of `fields` and fields consist of:
  1. `Field Name`
  2. `Field Type`
  3. `Type Modifiers` (Optional)
     1. `[]`: Make a list of the field type
     2. `?`: By default everything fields are required, `?` used to make it optional
  4. `Field Attributes` (Optional)
     1. `@id`: It defines the primary key of the model
     2. `@default`: It defines the default value of the field
     3. `@unique`: It defines the unique constraint of the field
     4. `@relation(fields: [current_field], references: [parent_field], [onDelete | onUpdate])`: It defines the relation between two models
- Additional Attributes:
  1. `@@map`: It defines the name of the table in the database
  2. `@@index`: It defines the index of the table in the database
  3. `@@unique`: It defines the unique constraint of the table in the database

## Relations in Prisma

- There are main three types of relations in Prisma:
  1. **One-to-One**:

      ```prisma
        model User {
          profile Profile? // these fields are going to skip on the database, it just used for the relation between two models on prisma schema 
        }

        model Profile {
          user User @relation(fields: [userId], references: [id])
          userId Int @unique
        }
      ```
  2. **One-to-Many**:
      
      ```prisma
        model User {
          id    String @id @default(cuid())
          posts Post[]
        }

        model Post {
          author   User  @relation(fields: [authorId], references: [id])
          authorId String
        }
      ```
  
  3. **Many-to-Many**:
      
      ```prisma
        model Post {
          id         Int                 @id @default(autoincrement())
          title      String
          categories CategoriesOnPosts[]
        }

        model Category {
          id    Int                 @id @default(autoincrement())
          name  String
          posts CategoriesOnPosts[]
        }

        model CategoriesOnPosts {
          post       Post     @relation(fields: [postId], references: [id])
          postId     Int
          category   Category @relation(fields: [categoryId], references: [id])
          categoryId Int
          assignedAt DateTime @default(now())
          assignedBy String
          @@id([postId, categoryId])
        }
      ```

## Important Prisma Commands

| Command              | Description                                                                              |
| -------------------- | ---------------------------------------------------------------------------------------- |
| `prisma init`        | Initializes a new Prisma project.                                                        |
| `prisma generate`    | Generates Prisma Client (Application Programming Interface) based on your Prisma schema. |
| `prisma migrate dev` | Applies migrations to your database (maps Prisma schema to underlying database).         |
| `prisma db pull`     | Pulls the database schema and updates your Prisma schema file.                           |
