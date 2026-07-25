# Nest.js

> Nest.js is a high-level backend framework used to build scalable and robust server-side applications. It is built on top of **Node.js** and commonly uses **Express.js** under the hood.

## Nest.js Folder Structure

Nest.js organizes code into modules. Each module usually represents one feature or route.

```txt
users/
    users.controller.ts    --> Handles routes like GET, POST, PATCH, DELETE
    users.service.ts       --> Contains business logic
    users.module.ts        --> Connects controller and service
```

Example route:

```txt
users.controller.ts  --> /users
```

## Nest.js Architecture

### 1. Middleware

Middleware runs before the request reaches the controller. In Nest.js, middleware is usually created by implementing `NestMiddleware`.

It is useful for logging, checking requests, or modifying request data.

Example:

```ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log(`${req.method} ${req.url}`);
    next();
  }
}
```

Apply middleware in module:

```ts
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('users');
  }
}
```

### 2. Controllers

Controllers handle incoming requests and return responses. They define routes using decorators like `@Get`, `@Post`, `@Patch`, and `@Delete`.

Example:

```ts
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';

@Controller('users')
export class UsersController {
  @Get()
  findAll() {
    return 'Get all users';
  }

  @Post()
  create(@Body() body: any) {
    return body;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: any) {
    return { id, body };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `Deleted user ${id}`;
  }
}
```

Routes created by this controller:

```txt
GET     /users
POST    /users
PATCH   /users/:id
DELETE  /users/:id
```

### 3. Route Parameters, Query, and Body

Nest.js gives request data using decorators.

#### Route Parameters

Route parameters get dynamic values from the URL.

Example URL:

```txt
GET /users/10
```

Example:

```ts
@Get(':id')
findOne(@Param('id') id: string) {
  return `User id is ${id}`;
}
```

#### Query Parameters

Query parameters get optional values from the URL after `?`.

Example URL:

```txt
GET /users?role=admin&active=true
```

Example:

```ts
@Get()
findAll(@Query('role') role: string, @Query('active') active: string) {
  return { role, active };
}
```

#### Body

Body is used to receive data sent by the client, mostly in `POST`, `PUT`, or `PATCH` requests.

Example request body:

```json
{
  "name": "John",
  "email": "john@example.com"
}
```

Example:

```ts
@Post()
create(@Body() body: any) {
  return body;
}
```

Using specific body fields:

```ts
@Post()
create(@Body('name') name: string, @Body('email') email: string) {
  return { name, email };
}
```

### 4. Interceptors

Interceptors run before or after the controller method. They are useful for changing responses, logging, or measuring request time.

Example response transform:

```ts
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((data) => ({
        success: true,
        data,
      })),
    );
  }
}
```

Use interceptor:

```ts
@UseInterceptors(ResponseInterceptor)
@Get()
findAll() {
  return ['user1', 'user2'];
}
```

Final response:

```json
{
  "success": true,
  "data": ["user1", "user2"]
}
```

### 5. Pipes

Pipes are used to validate or transform incoming data before it reaches the controller method.

Example with `ParseIntPipe`:

```ts
@Get(':id')
findOne(@Param('id', ParseIntPipe) id: number) {
  return id;
}
```

If the URL is:

```txt
GET /users/5
```

Then `id` becomes a number:

```ts
5;
```

If the URL is invalid:

```txt
GET /users/abc
```

Nest.js returns an error because `abc` cannot be converted into a number.

### 6. Exception Filters

Exception filters handle errors and return proper error responses.

Simple example:

```ts
import { NotFoundException } from '@nestjs/common';

@Get(':id')
findOne(@Param('id') id: string) {
  if (id !== '1') {
    throw new NotFoundException('User not found');
  }

  return { id, name: 'John' };
}
```

Response:

```json
{
  "message": "User not found",
  "error": "Not Found",
  "statusCode": 404
}
```

### 7. Guards

Guards decide whether a request can access a route or not. They are commonly used for authentication and authorization.

Example guard:

```ts
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class AuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    return request.headers.authorization === 'secret-token';
  }
}
```

Use guard:

```ts
@UseGuards(AuthGuard)
@Get('profile')
getProfile() {
  return 'User profile';
}
```

Example request:

```txt
GET /users/profile
Authorization: secret-token
```

If the token is correct, the route is allowed. If not, Nest.js blocks the request.

## Request Flow in Nest.js

A request usually flows like this:

```txt
Client Request
    ↓
Middleware
    ↓
Guards
    ↓
Interceptors
    ↓
Pipes
    ↓
Controller
    ↓
Service
    ↓
Response
```
