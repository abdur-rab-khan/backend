import { Inject, Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject('API_KEY')
    private readonly apiKey: string,
  ) {
    console.log('API_KEY from UserServices', this.apiKey);
  }

  getUserName(): string {
    throw new NotFoundException('User not found', {
      description: 'Because I did it',
    });
    return 'My Name is Abdur Rab Khan';
  }
}
