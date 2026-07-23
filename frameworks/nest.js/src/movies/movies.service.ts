import { Injectable } from '@nestjs/common';

@Injectable()
export class MoviesService {
  getMovieName(): string {
    return 'Avengers';
  }
}
