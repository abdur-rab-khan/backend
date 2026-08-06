import { Global, Module } from '@nestjs/common';

// Used to make the API_KEY provider available to other modules by registering it as a global provider into the root module
@Global()
@Module({
  providers: [
    {
      provide: 'API_KEY',
      useValue: 'heres-the-api-key',
    },
  ],
  exports: ['API_KEY'], // Used to tell that the API_KEY provider should be available to other modules
})
export class ConfigModule {}
