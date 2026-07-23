import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  getUserName(): string {
    return 'My Name is Abdur Rab Khan';
  }
}
