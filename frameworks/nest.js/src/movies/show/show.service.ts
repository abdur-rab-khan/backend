import { Injectable } from '@nestjs/common';

@Injectable()
export class ShowService {
  getShowName(): string {
    return 'Recent shows are: Silo and From';
  }
}
