import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { MoviesModule } from './movies/movies.module';
import { LoggerMiddlewareTsMiddleware } from './middleware/logger.middleware.ts.middleware';

@Module({
  imports: [UserModule, MoviesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddlewareTsMiddleware).forRoutes('user');
  }
}
