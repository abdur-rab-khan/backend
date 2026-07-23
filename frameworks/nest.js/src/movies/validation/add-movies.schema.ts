import { ZodError, ZodType } from 'zod';
import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';

export class AddMoviesValidationPipe implements PipeTransform {
  constructor(private readonly schema: ZodType) {}
  transform(value: any, metadata: ArgumentMetadata): unknown {
    try {
      this.schema.parse(value);
      return value;
    } catch (err) {
      const message =
        err instanceof ZodError ? err.issues[0]?.message : 'Validation failed';
      throw new BadRequestException(message);
    }
  }
}
