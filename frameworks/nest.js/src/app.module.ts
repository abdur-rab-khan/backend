import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { LoggerMiddlewareTsMiddleware } from './middleware/logger.middleware.ts.middleware';
import { ConfigModule } from './modules/config.module';

@Module({
  // 🔶 Import is about importing other modules into this module, so that their providers can be used in this module.
  imports: [UserModule, MoviesModule, ConfigModule],
  controllers: [AppController],
  // 🔶 Registers AppService as a provider in the Dependency Injection (DI) container.
  // 🔸 When another class (such as a controller or another provider) requests AppService,
  // 🔸 NestJS resolves it from the DI container and injects it automatically.

  // 🔶 By default, providers are singletons, meaning only one instance of AppService
  // 🔸 is created and shared wherever it is injected (within the same application context).

  // 🔶 DI Container, it just a map like data structure that holds the providers and it only accessible within the AppModule and it stores like this:
  // { AppService: <AppService instance>, 'APP_ONLY_API_KEY': 'heres-the-api-key' }
  providers: [
    AppService,
    {
      // 🔶 "useValue", just used to provide a simple value to the DI container, it can be "string", "number", "boolean", "object", etc.
      provide: 'APP_ONLY_API_KEY',
      useValue: 'heres-the-api-key',
    },
    {
      // 🔶 It's needs a function and then return a value to be injected into the DI container. It's also follows the singletons pattern, so the same instance is reused across the application.
      provide: 'RANDOM_NUMBER',
      useFactory: () => {
        return Math.random();
      },
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddlewareTsMiddleware).forRoutes('user');
  }
}
