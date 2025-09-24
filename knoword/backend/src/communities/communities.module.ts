import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { TagsService } from './tags.service';

@Module({
  controllers: [CommunitiesController],
  providers: [CommunitiesService, TagsService],
  exports: [TagsService],
})
export class CommunitiesModule {}
