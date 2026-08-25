import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { CacheTTL, Roles } from './roles.decorator';

@Injectable()
export class UserInterceptor<T> implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const role = this.reflector.get(Roles, context.getHandler());
    const cacheTTL = this.reflector.get(CacheTTL, context.getHandler());

    if (role == 'admin') {
      return of({
        data: null,
        metaData: null,
        cacheTTL: null,
        user: 'Hello from the interceptor',
      });
    }

    return next.handle().pipe(
      map((data: T) => ({
        data: data,
        role,
        cacheTTL,
        user: 'Hello from the interceptor',
      })),
    );
  }
}
