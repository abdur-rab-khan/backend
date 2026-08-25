import { Injectable, Scope } from '@nestjs/common';

// @Injectable() tells NestJS that this class can participate in the Dependency Injection system.
// When a controller requests AppService, NestJS looks for AppService in its DI container (which was built from the module's providers).
// If it finds it, NestJS creates an instance (if one doesn't already exist for the current scope) and injects it into the controller.
@Injectable({
  scope: Scope.DEFAULT, // Singleton
  // scope: Scope.REQUEST, Already known that by default it's a singleton meaning only one instance is created and reused across the application, 👉 But using Scope.REQUEST, it creates a new instance for each request and destroys it when the request is done.
  // scope: Scope.TRANSIENT, It creates a new instance not per request but per injection, suppose we have a user service, and we used them in three different controllers, each controller will get a new instance of the user service.
})
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
