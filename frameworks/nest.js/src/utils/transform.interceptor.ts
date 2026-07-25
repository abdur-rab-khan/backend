import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
// Interceptor mainly used to bind some extra logic "before/after" the route handler like "transform return result", "thrown exception from the function"
export class TransformInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>();
    const statusCode = (response?.statusText ?? '200') as string;

    return next.handle().pipe(
      map((data: T) => ({
        statusCode,
        message: '',
        data,
      })),
    );
  }
}
