import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Patch,
  Query,
  UnauthorizedException,
  UseGuards,
  Delete,
} from '@nestjs/common';
import { JwtGuard } from 'src/auth/guards';
import { CommunitiesService } from './communities.service';
import type { UserPayload } from 'src/auth/interfaces';
import {
  CreateCommunityDto,
  TagRecommendationDto,
  UpdateCommunityDto,
} from './dto';
import { GetUser } from 'src/auth/decorators';
import { TagsService } from './tags.service';

@Controller('communities')
export class CommunitiesController {
  constructor(
    private readonly communitiesService: CommunitiesService,
    private readonly tagsService: TagsService,
  ) {}

  @Post('create')
  @UseGuards(JwtGuard)
  async createCommunity(
    @Body() communityDto: CreateCommunityDto,
    @GetUser() user: UserPayload,
  ) {
    if (!user || !user.sub) {
      throw new UnauthorizedException('Usuario no válido');
    }
    return this.communitiesService.createCommunity(communityDto, user.sub);
  }

  @Get('tags/recommendations')
  async recommendTags(@Query() query: TagRecommendationDto) {
    const tag = query.tag;
    if (!tag) {
      throw new UnauthorizedException('Tag no proporcionado');
    }
    return this.tagsService.findRecommendations(tag);
  }

  @Get('explore')
  async exploreCommunities() {
    return this.communitiesService.getExploreCommunities();
  }

  @Get('community/:id')
  @UseGuards(JwtGuard)
  async getCommunityById(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserPayload,
  ) {
    return this.communitiesService.getCommunityById(id, user.sub);
  }

  @Get('by-tag/:tag')
  async getCommunitiesByTag(@Param('tag') tag: string) {
    return this.communitiesService.getCommunitiesByTag(tag);
  }

  @Get('my-communities')
  @UseGuards(JwtGuard)
  async getMyCommunities(@GetUser() user: UserPayload) {
    return this.communitiesService.getMyCommunities(user.sub);
  }

  @Post('join/:id')
  @UseGuards(JwtGuard)
  async joinCommunity(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserPayload,
  ) {
    return this.communitiesService.joinCommunity(id, user.sub);
  }

  @Delete('leave/:id')
  @UseGuards(JwtGuard)
  async leaveCommunity(
    @Param('id', ParseIntPipe) id: number,
    @GetUser() user: UserPayload,
  ) {
    return this.communitiesService.leaveCommunity(id, user.sub);
  }

  @Get('user-communities')
  @UseGuards(JwtGuard)
  async getUserCommunities(@GetUser() user: UserPayload) {
    return this.communitiesService.getUserCommunities(user.sub);
  }

  @Patch('community/:id')
  @UseGuards(JwtGuard)
  async updateCommunity(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCommunityDto,
    @GetUser() user: UserPayload,
  ) {
    return this.communitiesService.updateCommunity(id, dto, user.sub);
  }

  @Delete('community/:id')
  @UseGuards(JwtGuard)
  async deleteCommunity(@Param('id', ParseIntPipe) id: number) {
    return this.communitiesService.deleteCommunity(id);
  }
}
