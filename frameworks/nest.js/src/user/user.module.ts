import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
// import { UserInterceptor } from 'src/utils/user.interceptor';

@Module({
  // imports: [ConfigModule], 👉 Now, We don't need to import ConfigModule here because we are using "@Global()" this we can only import it once in the root module and it will be available throughout the application
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
