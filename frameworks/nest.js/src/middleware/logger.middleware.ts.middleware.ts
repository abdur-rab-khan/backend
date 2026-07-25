import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { AppService } from 'src/app.service';

@Injectable()
export class LoggerMiddlewareTsMiddleware implements NestMiddleware {
  constructor(private readonly appService: AppService) {} // Middleware uses "@Injectable()" means we can inject any dependecies services into the "middleware" with in the same module level
  use(req: Request, res: Response, next: NextFunction) {
    console.log('[LOGGER]: ', this.appService.getHello());
    next();
  }
}
