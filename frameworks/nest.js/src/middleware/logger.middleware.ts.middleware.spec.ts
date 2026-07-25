import { LoggerMiddlewareTsMiddleware } from './logger.middleware.ts.middleware';

describe('LoggerMiddlewareTsMiddleware', () => {
  it('should be defined', () => {
    expect(new LoggerMiddlewareTsMiddleware()).toBeDefined();
  });
});
