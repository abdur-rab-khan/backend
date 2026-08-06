import { Controller, Get, Inject } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    @Inject('API_KEY')
    private readonly apiKey: string,
    @Inject('RANDOM_NUMBER')
    private randomNum: number,
  ) {
    // Successfully injected the API_KEY from the app module
    console.log('Accessing from AppController', this.apiKey);
    console.log('Random Number is: ', this.randomNum);
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
