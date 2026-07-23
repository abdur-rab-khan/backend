import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { ShowModule } from './show/show.module';

@Module({
  controllers: [MoviesController],
  providers: [MoviesService],
  imports: [ShowModule]
})
export class MoviesModule {}
