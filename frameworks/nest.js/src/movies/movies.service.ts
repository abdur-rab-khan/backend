import {
  Injectable,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AddMoviesDto } from './dto/add-movies.dto';

@Injectable()
export class MoviesService {
  getMovieName(name: string, id: string): string {
    if (!name || !id) {
      throw new HttpException('name and id are required', HttpStatus.NOT_FOUND);
    }
    return JSON.stringify({
      id,
      name,
      message: 'Movie is added successfully',
    });
  }

  addMovie(addMoviesDto: AddMoviesDto): string {
    // Exception filter, it's used to throw meaningful error messages instead of directly throwing an error
    // Nest.js provides a built-in exception filter that can be used to handle exceptions
    if (!addMoviesDto) {
      throw new BadRequestException('addMoviesDto is required');
    }

    return JSON.stringify({
      data: addMoviesDto,
      message: 'Movie added successfully',
    });
  }
}
