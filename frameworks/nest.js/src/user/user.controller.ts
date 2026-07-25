import { Controller, Get, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/guards/auth.guard';
import { Roles } from 'src/utils/roles.decorator';

@Controller('user')
// @UseGuards(AuthGuard) // --> Applies "AuthGuard" to all routes and methods in this controller
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @Roles(['admin']) // --> Adding "Roles" as "admin", So that we can easily access through the guard using by injecting "reflector" in RoleGuard
  @UseGuards(AuthGuard)
  getUser(): string {
    return this.userService.getUserName();
  }
}
