# Nest.js
> A high-level backend framework help us to build scalable, robust system, using it we can easily build backend application under the hood nest.js uses **express.js** and **node.js**.

## Nest.js Folder Structure
- Every folder in *nest.js* have following files, and folder defines the route path:
  ```txt
  [module]                --> Defines the endpoints like "/users", "/movies"
      [.controller.ts]    --> Defines the endpoints like GET, POST, PUT, DELETE
      [.service.ts]       --> Defines the business logic
      [.module.ts]        --> Defines the module configuration
  ```

## Nest.js Architecture
