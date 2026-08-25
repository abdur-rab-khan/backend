import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { CacheTTL, Roles } from 'src/utils/roles.decorator';
import { UserInterceptor } from 'src/utils/user.interceptor';

@Controller('user')
// @UseGuards(AuthGuard) // --> Applies "AuthGuard" to all routes and methods in this controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles('admin') // --> Adding "Roles" as "admin", So that we can easily access through the guard using by injecting "reflector" in RoleGuard
  @CacheTTL({ key: 'user', ttl: 200 })
  @UseGuards(AuthGuard)
  @UseInterceptors(UserInterceptor)
  getUser(): string {
    return this.userService.getUserName();
  }
}
