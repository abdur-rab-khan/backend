import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class UserInterceptor<T> implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Hello from the user interceptor');
    return next.handle().pipe(
      map((data: T) => ({
        ...data,
        user: 'Hello from the interceptor',
      })),
    );
  }
}
