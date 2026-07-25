import { AddMoviesDto } from './add-movies.dto';
import { PartialType } from '@nestjs/mapped-types';

// Similar to TypeScript's "Partial<AddMoviesDto>" we can use PartialType to create a DTO that allows partial updates
export class UpdateUserDto extends PartialType(AddMoviesDto) {}
