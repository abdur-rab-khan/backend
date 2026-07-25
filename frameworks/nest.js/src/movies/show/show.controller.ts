import { Controller, Get } from '@nestjs/common';
import { ShowService } from './show.service';

@Controller('movies/show')
export class ShowController {
  constructor(private readonly showService: ShowService) {}

  @Get()
  getShowName(): string {
    return this.showService.getShowName();
  }
}
