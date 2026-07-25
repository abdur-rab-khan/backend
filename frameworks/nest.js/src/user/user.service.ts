import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserName(): string {
    throw new NotFoundException('User not found', {
      description: 'Because I did it',
    });
    return 'My Name is Abdur Rab Khan';
  }
}
