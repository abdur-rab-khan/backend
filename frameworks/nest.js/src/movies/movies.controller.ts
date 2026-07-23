import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  ParseIntPipe,
  HttpStatus,
  UsePipes,
  DefaultValuePipe,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import { AddMoviesDto } from './dto/add-movies.dto';
import { UpdateUserDto } from './dto/update-movies.dto';
import { AddMoviesValidationPipe } from './validation/add-movies.schema';
import { addMoviesSchema } from './schema/add-movies.schema';

@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @Get()
  getMovie(
    @Query('id', new DefaultValuePipe(1)) id: string,
    @Query('name', new DefaultValuePipe('No Name')) name: string,
  ): string {
    return this.moviesService.getMovieName(name, id);
  }

  @Post()
  // @HttpCode(204) // By default, Nest.js returns 201 on "Post request", but using "@HttpCode(204)" we can override it

  // Pipes are mainly used to validate or transform the request data like query parameters, request body, etc.
  // Right now in "addMovie" we only have one parameter, so we can use a single pipe to validate it. for specific parameter we can Pipe directly into the @Body() decorator
  @UsePipes(new AddMoviesValidationPipe(addMoviesSchema))
  addMovie(@Body() addMoviesDto: AddMoviesDto): string {
    return this.moviesService.addMovie(addMoviesDto);
  }

  @Delete()
  deleteMovie(): string {
    return 'Movie is deleted';
  }

  @Put(':id')
  updateMovie(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number, //
    @Body() updateMoviesDto: UpdateUserDto,
  ): string {
    console.log(typeof id);
    return `Movie with id ${id} is updated`;
  }

  @Get(':id')
  getMovieById(@Param('id', ParseIntPipe) id: number): string {
    return `Movie with id ${id} is fetched`;
  }
}
